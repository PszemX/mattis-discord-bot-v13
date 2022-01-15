import {
	BaseClient,
	ColorResolvable,
	Message,
	MessageEmbed,
	TextChannel,
	User,
} from 'discord.js';
import lang from '../../utilities/lang';
import colors from '../../utilities/colors.json';

export class RpsGame extends BaseClient {
	private readonly invReacts = ['✅', '❌'];
	private readonly rpsReacts = ['⛰️', '🧻', '✂️'];
	private readonly collectorOpts = { max: 1, time: 60000, errors: ['time'] };
	private guildMessage: Message | undefined;
	private rounds = 0;
	private gameEmbed: MessageEmbed = new MessageEmbed()
		.setColor(<ColorResolvable>colors.blue)
		.setTitle(lang('actions.rps.rpsTitle', this.data))
		.setTimestamp();
	startTimestamp = Date.now();

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
		this.gameEmbed
			.setAuthor('', this.playerOne.displayAvatarURL())
			.setDescription(`${this.playerOne} **VS** ${this.data.mattis.user}`)
			.setFooter(lang('actions.rps.singlePlayerDesc', this.data));
		this.gameChannel.send({ embeds: [this.gameEmbed] });
	}

	private async multiPlayerGame() {
		this.gameChannel.send('Multiplayer');
	}

	// private async checkWinner(playerOneChoice, playerTwoChoice) {
	// 	// const possibleChoices = ['⛰️', '🧻', '✂️'];
	// 	// const filter = (reaction: MessageReaction, user: User) => {
	// 	// 	return (
	// 	// 		possibleChoices.includes(<string>reaction.emoji.name) &&
	// 	// 		user.id == data.args.member.id
	// 	// 	);
	// 	// };
	// 	if (
	// 		(playerOneChoice === '⛰️' && playerTwoChoice === '✂️') ||
	// 		(playerOneChoice === '✂️' && playerTwoChoice === '🧻') ||
	// 		(playerOneChoice === '🧻' && playerTwoChoice === '⛰️')
	// 	) {
	// 		this.gameFinish(this.playerOne, p1Choice, p2Choice, [p1, p2]);
	// 	} else if (p1Choice == p2Choice) {
	// 		let emb = this.genRpsEmbed('draw', p1Choice, p2Choice); // embed remisu gry, wysyłany na kanał serwera? jak chcesz chyba dasz radę zmienić
	// 		this.guildMessage.edit(emb);
	// 		p1.edit(emb);
	// 		p2.edit(emb);
	// 		this.gameRound();
	// 	} else {
	// 		this.gameFinish(this.playerTwo, p1Choice, p2Choice, [p1, p2]);
	// 	}
	// }
}
