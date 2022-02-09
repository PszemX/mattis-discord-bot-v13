import {
	BaseClient,
	ButtonInteraction,
	Collection,
	ColorResolvable,
	InteractionCollector,
	Message,
	MessageActionRow,
	MessageAttachment,
	MessageButton,
	MessageEmbed,
	TextChannel,
	User,
} from 'discord.js';
import * as colors from '../../utilities/colors.json';
import lang from '../../utilities/lang';
import { clientId } from '../../config';
import Canvas from 'canvas';

export class RpsGame extends BaseClient {
	private readonly actionSettings =
		this.data.guildCache.settings.actions['rps'];
	private readonly possibleChoices = ['rock', 'paper', 'scissors'];
	private isMultiplayerGame: boolean = false;
	private playerOnePoints: number = 0;
	private playerTwoPoints: number = 0;
	private playersCount: number = 1;
	private gameMessage!: Message;
	private gameEmbed: MessageEmbed = new MessageEmbed()
		.setAuthor(
			lang('actions.rps.rpsTitle', this.data),
			this.playerOne.displayAvatarURL()
		)
		.setColor(<ColorResolvable>colors.blue)
		.setTimestamp();
	private readonly playAgainButton = new MessageButton()
		.setCustomId('restart')
		.setLabel(lang('actions.rps.playAgain', this.data))
		.setStyle(1);
	private readonly acceptButton = new MessageButton()
		.setCustomId('accept')
		.setLabel(lang('actions.rps.accept', this.data))
		.setStyle(3);
	private readonly declineButton = new MessageButton()
		.setCustomId('decline')
		.setLabel(lang('actions.rps.decline', this.data))
		.setStyle(4);

	constructor(
		private playerOne: User,
		private playerTwo: User,
		private gameChannel: TextChannel,
		private maxPoints: Number,
		private data: any
	) {
		super();
		this.gameStart();
	}

	private async gameStart() {
		if (this.playerTwo?.id != clientId) {
			this.playersCount = 2;
			this.isMultiplayerGame = true;
		}
		await this.gameBegin();
	}

	private async gameBegin() {
		if (this.isMultiplayerGame) {
			await this.inviteOpponent();
		} else {
			await this.generateGameBeginMessage();
		}
	}

	private async inviteOpponent() {
		this.setInvitationEmbed();
		const row = await this.createButtonRow([
			this.acceptButton,
			this.declineButton,
		]);
		await this.sendGameMessage(null, row);
		this.createRpsMessageButtonsCollector(Infinity, 'invitation');
	}

	private async createRpsMessageButtonsCollector(max: number, type: string) {
		const filter = (btnInteraction: any) => {
			btnInteraction.deferUpdate();
			return (
				(btnInteraction.user.id === this.playerOne.id ||
					btnInteraction.user.id === this.playerTwo.id) &&
				btnInteraction.message.id === this.gameMessage.id
			);
		};
		const collector = this.gameMessage.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
			max: max,
			time: 30000,
		});
		switch (type) {
			case 'invitation':
				await this.invitationButtonsCollector(collector);
				break;
			case 'game':
				await this.gameButtonsCollector(collector);
				break;
		}
	}

	private async invitationButtonsCollector(
		collector: InteractionCollector<ButtonInteraction>
	) {
		collector.on('collect', async (i) => {
			if (i.customId == 'decline') {
				await this.collectorTimeExpired('invitationDeclined');
			} else if (i.customId == 'accept' && i.user.id == this.playerTwo.id) {
				collector.stop();
			}
		});
		collector.on('end', async (collection) => {
			if (collection.size < 1) {
				await this.collectorTimeExpired('invitationTimeExpired');
			} else {
				await this.generateGameBeginMessage();
			}
		});
	}

	private async gameButtonsCollector(
		collector: InteractionCollector<ButtonInteraction>
	) {
		let collected = 0;
		let playerOneChoice: string = '';
		let playerTwoChoice: string = '';
		collector.on('collect', async (i) => {
			if (i.user.id == this.playerOne.id) {
				playerOneChoice = i.customId;
			} else {
				playerTwoChoice = i.customId;
			}
			collected++;
			if (this.isMultiplayerGame) {
				if (collected == this.playersCount) {
					const roundStatus = await this.roundWinner(
						playerOneChoice,
						playerTwoChoice
					);
					if (this.gameMessage) {
						this.gameMessage.edit({
							embeds: [
								await this.generateRoundEndEmbed(
									roundStatus,
									playerOneChoice,
									playerTwoChoice
								),
							],
							components: [],
						});
						collector.stop();
					}
				}
			} else {
				playerTwoChoice = this.randomMove();
				const roundStatus = await this.roundWinner(
					playerOneChoice,
					playerTwoChoice
				);
				if (this.gameMessage) {
					this.gameMessage.edit({
						embeds: [
							await this.generateRoundEndEmbed(
								roundStatus,
								playerOneChoice,
								playerTwoChoice
							),
						],
						components: [],
					});
					collector.stop();
				}
			}
		});
		collector.on('end', async (collection) => {
			if (collection.size < this.playersCount) {
				await this.collectorTimeExpired('moveTimeExpired');
			}
			if (
				this.playerOnePoints < this.maxPoints &&
				this.playerTwoPoints < this.maxPoints
			) {
				await this.generateGameBeginMessage();
			}
		});
	}

	private async setInvitationEmbed() {
		this.gameEmbed
			.setTitle(lang('actions.rps.invitationSent', this.data))
			.setThumbnail(this.playerTwo.displayAvatarURL())
			.setDescription(
				lang('actions.rps.multiPlayerInvitation', this.data, {
					p1: this.playerOne,
					p2: this.playerTwo,
				})
			)
			.setFooter(lang('actions.rps.multiPlayerAccept', this.data));
	}

	private async createButtonRow(buttons: MessageButton[]) {
		let row = new MessageActionRow();
		for (const button of buttons) {
			row.addComponents(button);
		}
		return row;
	}

	private async generateGameBeginMessage() {
		const canvas = await this.createGameCanvas();
		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'rpsBackground.png'
		);

		this.gameEmbed
			.spliceFields(0, 2)
			.setDescription(`${this.playerOne} **VS** ${this.playerTwo}`)
			.setThumbnail('')
			.setTitle('')
			.setFooter(lang('actions.rps.singlePlayerDesc', this.data))
			.setImage('attachment://rpsBackground.png');

		if (this.maxPoints > 1) this.addEmbedPlayersDashboard(this.gameEmbed);

		const row = this.generateRpsButtons();
		await this.sendGameMessage(attachment, row);
		await this.createRpsMessageButtonsCollector(2, 'game');
	}

	private async sendGameMessage(attachment: any, row: MessageActionRow) {
		if (this.gameMessage) {
			this.gameMessage.edit({
				embeds: [this.gameEmbed],
				files: attachment ? [attachment] : [],
				components: row ? [row] : [],
			});
		} else {
			this.gameMessage = await this.gameChannel.send({
				embeds: [this.gameEmbed],
				files: attachment ? [attachment] : [],
				components: row ? [row] : [],
			});
		}
	}

	private async collectorTimeExpired(reason: string) {
		const timeoutEmbed: MessageEmbed = await this.timeoutEmbed(reason);
		if (this.gameMessage) {
			this.gameMessage.edit({
				embeds: [timeoutEmbed],
				files: [],
				components: [],
				attachments: [],
			});
		}
	}

	private randomMove() {
		return this.possibleChoices[
			Math.floor(Math.random() * this.possibleChoices.length)
		];
	}

	private async roundWinner(playerOneChoice: string, playerTwoChoice: string) {
		if (
			(playerOneChoice === 'rock' && playerTwoChoice === 'scissors') ||
			(playerOneChoice === 'scissors' && playerTwoChoice === 'paper') ||
			(playerOneChoice === 'paper' && playerTwoChoice === 'rock')
		) {
			this.playerOnePoints++;
			return 'victory';
		} else if (playerOneChoice == playerTwoChoice) {
			return 'draw';
		} else {
			this.playerTwoPoints++;
			return 'lose';
		}
	}

	private async generateRoundEndEmbed(
		status: string,
		playerOneChoice: string,
		playerTwoChoice: string
	) {
		let embed = new MessageEmbed()
			.addField(
				this.playerOne.username,
				lang(`actions.rps.${playerOneChoice}Emoji`, this.data),
				true
			)
			.addField('**VS**', '\u200b', true)
			.addField(
				this.playerTwo.username,
				lang(`actions.rps.${playerTwoChoice}Emoji`, this.data),
				true
			)
			.setFooter(lang('actions.rps.playAgain', this.data))
			.setImage('attachment://rpsBackground.png')
			.setTimestamp();

		if (status == 'victory') {
			embed
				.setAuthor(
					this.isMultiplayerGame
						? lang(
								this.playerOnePoints < this.maxPoints
									? 'actions.rps.multiPlayerRoundVictory'
									: 'actions.rps.multiPlayerGameVictory',
								this.data,
								this.playerOne.username
						  )
						: lang('actions.rps.singlePlayerVictory', this.data),
					this.playerOne.displayAvatarURL()
				)
				.setColor(
					this.isMultiplayerGame
						? <ColorResolvable>colors.blue
						: <ColorResolvable>colors.green
				);
		} else if (status == 'lose') {
			embed
				.setAuthor(
					this.isMultiplayerGame
						? lang(
								this.playerTwoPoints < this.maxPoints
									? 'actions.rps.multiPlayerRoundVictory'
									: 'actions.rps.multiPlayerGameVictory',
								this.data,
								this.playerTwo.username
						  )
						: lang('actions.rps.singlePlayerLose', this.data),
					this.isMultiplayerGame
						? this.playerTwo.displayAvatarURL()
						: this.playerOne.displayAvatarURL()
				)
				.setColor(
					this.isMultiplayerGame
						? <ColorResolvable>colors.blue
						: <ColorResolvable>colors.red
				);
		} else if (status == 'draw') {
			embed
				.setAuthor(
					lang('actions.rps.singlePlayerDraw', this.data),
					this.playerOne.displayAvatarURL()
				)
				.setColor(<ColorResolvable>colors.orange);
		}
		if (this.maxPoints > 1) this.addEmbedPlayersDashboard(embed);
		return embed;
	}

	private async createGameCanvas() {
		const canvas = Canvas.createCanvas(1000, 300);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage('src/images/RpsBackground2.jpg');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		context.font = '100px Arial Black';
		context.fillStyle = '#ffffff';
		context.textAlign = 'center';
		context.fillText('VS', canvas.width / 2, canvas.height / 1.7);
		context.beginPath();
		context.arc(225, 150, 125, 0, Math.PI * 2, true);
		context.arc(775, 150, 125, 0, Math.PI * 2, true);
		context.clip();
		const playerOneAvatar = await Canvas.loadImage(
			this.playerOne.displayAvatarURL({ format: 'jpg' })
		);
		context.drawImage(playerOneAvatar, 100, 25, 250, 250);
		const playerTwoAvatar = await Canvas.loadImage(
			this.playerTwo.displayAvatarURL({ format: 'jpg' })
		);
		context.drawImage(playerTwoAvatar, 650, 25, 250, 250);
		return canvas;
	}

	private async addEmbedPlayersDashboard(embed: MessageEmbed) {
		embed
			.addField(
				lang('actions.rps.players', this.data),
				`${this.playerOne}\n${this.playerTwo}`,
				true
			)
			.addField(
				lang('actions.rps.points', this.data),
				`${this.playerOnePoints}\n${this.playerTwoPoints}`,
				true
			);
	}

	private async timeoutEmbed(reason: string) {
		let embed = new MessageEmbed().setColor(<ColorResolvable>colors.red);
		const langPath: string = `actions.rps.${reason}`;
		embed.setDescription(lang(langPath, this.data));
		return embed;
	}
	private generateRpsButtons() {
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('rock')
				.setLabel(lang('actions.rps.rock', this.data))
				.setStyle(1)
				.setEmoji(lang('actions.rps.rockEmoji', this.data)),
			new MessageButton()
				.setCustomId('paper')
				.setLabel(lang('actions.rps.paper', this.data))
				.setStyle(1)
				.setEmoji(lang('actions.rps.paperEmoji', this.data)),
			new MessageButton()
				.setCustomId('scissors')
				.setLabel(lang('actions.rps.scissors', this.data))
				.setStyle(1)
				.setEmoji(lang('actions.rps.scissorsEmoji', this.data))
		);
		return row;
	}
}
