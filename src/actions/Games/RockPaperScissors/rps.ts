import lang from '../../../utilities/lang';
import colors from '../../../utilities/colors.json';
import { RpsGame } from '../../../structures/ActionStructures/RpsGame';
import { TextChannel, User } from 'discord.js';
module.exports = {
	id: 'rps',
	event: 'command',
	tags: { game: true },
	syntaxes: [[], [{ type: 'member', name: 'targetMember' }]],
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
		new RpsGame({ playerOne, playerTwo, gameChannel, data });
	},
};
