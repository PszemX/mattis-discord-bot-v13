import DiscordJS, { Presence } from 'discord.js';
import { BaseEvent } from '../classes/BaseEvent';
import { DefineEvent } from '../utilities/decorators/DefineEvent';

@DefineEvent('ready')
export class ReadyEvent extends BaseEvent {
	public async execute() {
		await this.doPresence();

		const totalMembers = this.client.guilds.cache.reduce(
			(membersSum: number, guild: DiscordJS.Guild) =>
				(membersSum += guild.memberCount),
			0
		);
		console.log('╠═══════════════════════╗');
		console.log('╠   Mattis is running!  ╬');
		console.log('╠═══════════════════════╬');
		console.log(`╠ Guilds: ${this.client.guilds.cache.size}`);
		console.log(`╠ Members: ${totalMembers}`);
		console.log(`╠ Discord.js: ${DiscordJS.version}`);
		console.log(`╠ Node.js: ${process.version}`);
		console.log('╠═══════════════════════╝');
	}

	private async setPresence(random: boolean): Promise<any> {
		const activityNumber = random
			? Math.floor(
					Math.random() * this.client.config.presenceData.activities.length
			  )
			: 0;
		const statusNumber = random
			? Math.floor(
					Math.random() * this.client.config.presenceData.status.length
			  )
			: 0;
		const activity: any = (
			await Promise.all(
				this.client.config.presenceData.activities.map(async (a: any) =>
					Object.assign(a, { name: await a.name })
				)
			)
		)[activityNumber];
		return this.client.user!.setPresence({
			activities: [activity] || [],
			status: this.client.config.presenceData.status[statusNumber],
		});
	}

	private async doPresence(): Promise<Presence | undefined> {
		try {
			return this.setPresence(false);
		} catch (e) {
			if ((e as Error).message !== 'Shards are still being spawned.')
				this.client.logger.error(String(e));
			return undefined;
		} finally {
			setInterval(
				() => this.setPresence(true),
				this.client.config.presenceData.interval
			);
		}
	}
}
