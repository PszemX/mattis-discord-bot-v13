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
import Canvas from 'canvas';
import lang from '../../../utilities/lang';
import colors from '../../../utilities/colors.json';
import { clientId } from '../../../config';

export class RpsGame extends BaseClient {
	private readonly possibleChoices = ['rock', 'paper', 'scissors'];
	private gameMessage!: Message;
	private gameEmbed: MessageEmbed = new MessageEmbed()
		.setColor(<ColorResolvable>colors.blue)
		.setTimestamp();
	private isMultiplayerGame: boolean = false;
	private actionSettings = this.data.guildCache.settings.actions['rps'];

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
			this.singleplayerGame();
		} else {
			this.isMultiplayerGame = true;
			this.multiplayerGame();
		}
	}
	private async singleplayerGame() {
		this.generateGameBeginMessage();
		this.gameRound();
	}

	private async multiplayerGame() {
		// this.inviteOpponent();
		// this.generateGameBeginMessage();
		// this.gameRound();
		this.gameChannel.send('Multiplayer');
	}

	private async generateGameBeginMessage() {
		const canvas = await this.createGameCanvas();
		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'rpsBackground.png'
		);

		this.gameEmbed
			.setAuthor(
				lang('actions.rps.rpsTitle', this.data),
				this.playerOne.displayAvatarURL()
			)
			.setDescription(`${this.playerOne} **VS** ${this.data.mattis.user}`)
			.setFooter(lang('actions.rps.singlePlayerDesc', this.data))
			.setImage('attachment://rpsBackground.png');

		if (this.maxPoints > 1) this.addEmbedPlayersDashboard();

		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('rock')
				.setLabel(lang('actions.rps.rock', this.data))
				.setStyle('PRIMARY')
				.setEmoji(lang('actions.rps.rockEmoji', this.data)),
			new MessageButton()
				.setCustomId('paper')
				.setLabel(lang('actions.rps.paper', this.data))
				.setStyle('PRIMARY')
				.setEmoji(lang('actions.rps.paperEmoji', this.data)),
			new MessageButton()
				.setCustomId('scissors')
				.setLabel(lang('actions.rps.scissors', this.data))
				.setStyle('PRIMARY')
				.setEmoji(lang('actions.rps.scissorsEmoji', this.data))
		);
		this.gameMessage = await this.gameChannel.send({
			embeds: [this.gameEmbed],
			files: [attachment],
			components: [row],
		});
	}

	private async addEmbedPlayersDashboard() {
		this.gameEmbed
			.addField(lang('actions.rps.players', this.data), 'Pszemo\nMattis', true)
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
		switch (reason) {
			case 'invitationTimeExpired':
				embed.setDescription(
					lang('actions.rps.invitationTimeExpired', this.data)
				);
				break;
			case 'invitationDeclined':
				embed.setDescription(lang('actions.rps.invitationDeclined', this.data));
				break;
			case 'moveTimeExpired':
				embed.setDescription(lang('actions.rps.moveTimeExpired', this.data));
				break;
		}
		return embed;
	}

	private async gameRound() {
		const filter = (btnInteraction: any) => {
			btnInteraction.deferUpdate();
			return (
				btnInteraction.user.id === this.playerOne.id &&
				btnInteraction.message.id === this.gameMessage.id
			);
		};
		const collector = this.gameChannel.createMessageComponentCollector({
			componentType: 'BUTTON',
			filter,
			max: 1,
			time: 30000,
		});
		const botChoice: string = this.randomMove();

		collector.on('collect', async (i) => {
			const playerOneChoice = i.customId;
			const roundStatus = await this.roundWinner(playerOneChoice, botChoice);
			if (this.gameMessage) {
				this.gameMessage.edit({
					embeds: [
						await this.generateRoundEndEmbed(
							roundStatus,
							this.playerOne,
							this.playerTwo,
							playerOneChoice,
							botChoice
						),
					],
					components: [],
				});
			}
		});
		collector.on('end', async (collection) => {
			if (collection.size == 0) {
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
			return 'playerOne';
		} else if (playerOneChoice == playerTwoChoice) {
			return 'draw';
		} else {
			return 'playerTwo';
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
			.setFooter(lang('actions.rps.playOneMoreTime', this.data))
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
