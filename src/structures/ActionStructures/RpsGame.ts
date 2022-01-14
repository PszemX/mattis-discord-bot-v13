import { BaseClient, Message, TextChannel, User } from 'discord.js';
import lang from '../../utilities/lang';

export class RpsGame extends BaseClient {
	private readonly invReacts = ['✅', '❌'];
	private readonly rpsReacts = ['⛰️', '🧻', '✂️'];
	private readonly collectorOpts = { max: 1, time: 60000, errors: ['time'] };
	private guildMessage: Message | undefined;
	private playerOne: User | undefined;
	private playerTwo: User | undefined;
	private gameChannel: TextChannel | undefined;
	rounds = 0;
	startTimestamp = Date.now();
	data: any;

	constructor(args: {
		playerOne: User;
		playerTwo: User;
		gameChannel: TextChannel;
		data: any;
	}) {
		super();
		Object.assign(this, args);
		this.gameStart();
	}

	private async gameStart() {
		if (this.gameChannel) this.gameChannel.send('Siema');
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
