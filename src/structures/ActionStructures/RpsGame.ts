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
import lang from '../../utilities/lang';
import colors from '../../utilities/colors.json';

export class RpsGame extends BaseClient {
	private readonly invReacts = ['✅', '❌'];
	private readonly rpsReacts = ['⛰️', '🧻', '✂️'];
	private readonly possibleChoices = ['rock', 'paper', 'scissors'];
	private readonly collectorOpts = { max: 1, time: 60000, errors: ['time'] };
	private gameMessage: Message | undefined;
	private rounds = 0;
	private gameEmbed: MessageEmbed = new MessageEmbed()
		.setColor(<ColorResolvable>colors.blue)
		.setTimestamp();
	startTimestamp = Date.now();
	private actionSettings = this.data.guildCache.settings.actions['rps'];

	constructor(
		private playerOne: User,
		private playerTwo: User,
		private gameChannel: TextChannel,
		private data: any
	) {
		super();
		this.gameStart();
	}

	private async gameStart() {
		// this.gameChannel.send({ embeds: [this.gameEmbed] });
		if (this.playerTwo?.id == '705066462083285014') {
			this.singlePlayerGame();
		} else {
			this.multiPlayerGame();
		}
	}
	private async singlePlayerGame() {
		this.generateGameMessage();
		this.gameRound();
	}

	private async multiPlayerGame() {
		// this.inviteOpponent();
		// this.generateGameMessage();
		// this.gameRound();
		this.gameChannel.send('Multiplayer');
	}

	private async generateGameMessage() {
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

	private async gameRound() {
		const filter = (btnInteraction: any) => {
			return btnInteraction.user.id === this.playerOne.id;
		};

		const collector = this.gameChannel.createMessageComponentCollector({
			filter,
			max: 1,
			time: 30000,
		});
		const botChoice =
			this.possibleChoices[
				Math.floor(Math.random() * this.possibleChoices.length)
			];
		collector.on('collect', async (i) => {
			const playerOneChoice = i.customId;
			if ((await this.checkWinner(playerOneChoice, botChoice)) == 'playerOne') {
				i.reply(`Wygrales! Ty: ${playerOneChoice}, Mattis: ${botChoice}`);
			} else {
				i.reply(`Przegrales! Ty: ${playerOneChoice}, Mattis: ${botChoice}`);
			}
		});
	}

	private async checkWinner(playerOneChoice: string, playerTwoChoice: string) {
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
}
