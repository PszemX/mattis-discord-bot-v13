import DiscordJS from 'discord.js';
import { mattis } from '../bot';

module.exports = {
	name: 'ready',
	execute: async () => {
		const totalMembers = mattis.guilds.cache.reduce(
			(membersSum: number, guild: DiscordJS.Guild) =>
				(membersSum += guild.memberCount),
			0
		);
		console.log('╔═══════════════════════╗');
		console.log('╠   Mattis is running!  ╬');
		console.log('╠═══════════════════════╬');
		console.log(`╠ Guilds: ${mattis.guilds.cache.size}`);
		console.log(`╠ Members: ${totalMembers}`);
		console.log(`╠ Discord.js: ${DiscordJS.version}`);
		console.log(`╠ Node.js: ${process.version}`);
		console.log('╚═══════════════════════╝');
	},
};
