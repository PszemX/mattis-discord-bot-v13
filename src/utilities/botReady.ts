import DiscordJS, { Presence } from 'discord.js';
import * as config from '../config';
import { mattis } from '../bot';

const botReady = async () => {
	await doPresence();

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
};

const setPresence = async (random: boolean): Promise<any> => {
	const activityNumber = random
		? Math.floor(Math.random() * config.presenceData.activities.length)
		: 0;
	const statusNumber = random
		? Math.floor(Math.random() * config.presenceData.status.length)
		: 0;
	const activity: any = (
		await Promise.all(
			config.presenceData.activities.map(async (a: any) =>
				Object.assign(a, { name: await a.name })
			)
		)
	)[activityNumber];
	return mattis.user!.setPresence({
		activities: [activity] || [],
		status: config.presenceData.status[statusNumber],
	});
};

const doPresence = async (): Promise<Presence | undefined> => {
	try {
		return setPresence(false);
	} catch (e) {
		if ((e as Error).message !== 'Shards are still being spawned.')
			mattis.logger.error(String(e));
		return undefined;
	} finally {
		setInterval(() => setPresence(true), config.presenceData.interval);
	}
};

export { botReady };
