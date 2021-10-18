import DiscordJS from 'discord.js';
import figlet from 'figlet';
import { mattis } from '../bot';

export class ReadyEvent {
	public name = 'ready';

	public constructor() {}

	public async execute() {
		const totalMembers = mattis.guilds.cache.reduce(
			(membersSum: number, guild: DiscordJS.Guild) =>
				(membersSum += guild.memberCount),
			0
		);
		console.log('╠═══════════════════════╗');
		console.log('╠   Mattis is running!  ╬');
		console.log('╠═══════════════════════╬');
		console.log(`╠ Guilds: ${mattis.guilds.cache.size}`);
		console.log(`╠ Members: ${totalMembers}`);
		console.log(`╠ Discord.js: ${DiscordJS.version}`);
		console.log(`╠ Node.js: ${process.version}`);
		console.log('╠═══════════════════════╝');
	}
}
