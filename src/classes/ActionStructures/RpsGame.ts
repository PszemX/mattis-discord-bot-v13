import {
	BaseClient,
	ButtonInteraction,
	ColorResolvable,
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
	private readonly possibleChoices = ['rock', 'paper', 'scissors'];
	private gameMessage!: Message;
	private gameEmbed: MessageEmbed = new MessageEmbed()
		.setAuthor(
			lang('actions.rps.rpsTitle', this.data),
			this.playerOne.displayAvatarURL()
		)
		.setColor(<ColorResolvable>colors.blue)
		.setTimestamp();
	private isMultiplayerGame: boolean = false;
	private playersCount: number = 1;
	private actionSettings = this.data.guildCache.settings.actions['rps'];
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
		if (this.playerTwo?.id == clientId) {
			await this.singleplayerGame();
		} else {
			this.multiplayerGame();
		}
	}
	private async singleplayerGame() {
		await this.generateGameBeginMessage();
		await this.singleplayerGameRound();
	}

	private async multiplayerGame() {
		this.playersCount = 2;
		this.isMultiplayerGame = true;
		await this.inviteOpponent();
		await this.generateGameBeginMessage();
		await this.multiplayerGameRound();
	}

	private async inviteOpponent() {}

	private async generateGameBeginMessage() {
		const canvas = await this.createGameCanvas();
		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'rpsBackground.png'
		);

		this.gameEmbed
			.setDescription(`${this.playerOne} **VS** ${this.playerTwo}`)
			.setFooter(lang('actions.rps.singlePlayerDesc', this.data))
			.setImage('attachment://rpsBackground.png');

		if (this.maxPoints > 1) this.addEmbedPlayersDashboard();

		const row = this.generateRpsButtons();
		await this.setGameMessage(attachment, row);
	}

	private async setGameMessage(attachment?: any, row?: MessageActionRow) {
		this.gameMessage = await this.gameChannel.send({
			embeds: [this.gameEmbed],
			files: [attachment],
			components: row ? [row] : [],
		});
	}

	private async addEmbedPlayersDashboard() {
		this.gameEmbed
			.addField(
				lang('actions.rps.players', this.data),
				`${this.playerOne.username}\n${this.playerTwo.username}`,
				true
			)
			.addField(lang('actions.rps.points', this.data), '0\n0', true);
	}

	private async createGameCanvas() {
		const canvas = Canvas.createCanvas(1000, 300);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage('src/images/RpsBackground.jpg');
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

	private async singleplayerGameRound() {
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
			max: this.playersCount,
			time: 30000,
		});

		collector.on('collect', async (i) => {
			let playerOneChoice!: string;
			let playerTwoChoice: string = this.isMultiplayerGame
				? ''
				: this.randomMove();
			if (i.user.id == this.playerOne.id) {
				playerOneChoice = i.customId;
			} else {
				playerTwoChoice = i.customId;
			}
			const roundStatus = await this.roundWinner(
				playerOneChoice,
				playerTwoChoice
			);
			if (this.gameMessage) {
				this.gameMessage.edit({
					embeds: [
						await this.generateRoundEndEmbed(
							roundStatus,
							this.playerOne,
							this.playerTwo,
							playerOneChoice,
							playerTwoChoice
						),
					],
					components: [],
				});
			}
		});
		collector.on('end', async (collection) => {
			if (collection.size < this.playersCount) {
				const timeoutEmbed: MessageEmbed = await this.timeoutEmbed(
					'moveTimeExpired'
				);
				if (this.gameMessage) {
					this.gameMessage.edit({
						embeds: [timeoutEmbed],
						files: [],
						components: [],
						attachments: [],
					});
				}
			}
		});
	}

	private async multiplayerGameRound() {
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
			max: this.playersCount,
			time: 30000,
		});
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
								this.playerOne,
								this.playerTwo,
								playerOneChoice,
								playerTwoChoice
							),
						],
						components: [],
					});
				}
			}
		});
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
			return 'victory';
		} else if (playerOneChoice == playerTwoChoice) {
			return 'draw';
		} else {
			return 'lose';
		}
	}

	private async generateRoundEndEmbed(
		status: string,
		winningPlayer: User,
		loserPlayer: User,
		winningPlayerChoice: string,
		loserPlayerChoice: string
	) {
		let embed = new MessageEmbed()
			.addField(
				winningPlayer.username,
				lang(`actions.rps.${winningPlayerChoice}Emoji`, this.data),
				true
			)
			.addField('**VS**', '\u200b', true)
			.addField(
				loserPlayer.username,
				lang(`actions.rps.${loserPlayerChoice}Emoji`, this.data),
				true
			)
			.setFooter(lang('actions.rps.playAgain', this.data))
			.setImage('attachment://rpsBackground.png')
			.setTimestamp();

		if (status == 'victory') {
			embed
				.setAuthor(
					lang('actions.rps.singlePlayerVictory', this.data),
					winningPlayer.displayAvatarURL()
				)
				.setColor(<ColorResolvable>colors.green);
		} else if (status == 'lose') {
			embed
				.setAuthor(
					lang('actions.rps.singlePlayerLose', this.data),
					winningPlayer.displayAvatarURL()
				)
				.setColor(<ColorResolvable>colors.red);
		} else if (status == 'draw') {
			embed
				.setAuthor(
					lang('actions.rps.singlePlayerDraw', this.data),
					winningPlayer.displayAvatarURL()
				)
				.setColor(<ColorResolvable>colors.orange);
		}
		return embed;
	}
}
