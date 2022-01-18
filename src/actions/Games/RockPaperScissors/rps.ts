import { RpsGame } from '../../../structures/ActionStructures/RpsStructures/RpsGame';
import { TextChannel, User } from 'discord.js';
module.exports = {
	id: 'rps',
	event: 'command',
	tags: { game: true },
	syntaxes: [
		[],
		[{ type: 'natural', name: 'maxPoints' }],
		[{ type: 'member', name: 'targetMember' }],
		[
			{ type: 'member', name: 'targetMember' },
			{ type: 'natural', name: 'maxPoints' },
		],
	],
	func: async function (data: any, parameters: any) {
		const playerOne: User = data.args.member.user;
		const playerTwo: User = parameters.targetMember;
		const gameChannel: TextChannel = data.args.channel;
		if (playerTwo == data.args.member.id) return;
		let opponent: User;
		if (!playerTwo) {
			opponent = data.mattis.user;
		} else {
			opponent = data.targetMember.user;
		}
		let maxPoints: Number = 1;
		if (parameters.maxPoints) maxPoints = parameters.maxPoints;
		new RpsGame(playerOne, opponent, gameChannel, maxPoints, data);
	},
};
