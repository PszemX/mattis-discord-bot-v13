import { Guild } from 'discord.js';
import { GuildCache } from '../../classes/GuildCache';
import { BaseJob } from '../../classes/BaseJob';
import { clearTimeout } from 'timers';

export class SendMessageJob extends BaseJob {
	public constructor() {
		super('sendMessageJob', 'job');
	}
	private intervals: NodeJS.Timeout[] = [];
	private timeouts: NodeJS.Timeout[] = [];

	public async execute(guild: Guild, guildCache: GuildCache): Promise<void> {
		const guildMessageJobs =
			guildCache.settings.actions.sendMessageJob.messageJobs;
		for (const messageJob of guildMessageJobs) {
			if (messageJob.enabled) await this.setupInterval(guild, messageJob);
		}
	}

	public async clear(): Promise<void> {
		for (const interval of this.intervals) {
			clearInterval(interval);
		}
		for (const timeout of this.timeouts) {
			clearTimeout(timeout);
		}
	}

	private async sendMessageInterval(guild: Guild, messageJob: any) {
		const channel: any = guild.channels.cache.get(messageJob.channelId);
		await channel.send(messageJob.message).then(() => {
			var interval = setInterval(async () => {
				await channel.send(messageJob.message);
			}, messageJob.intervalTime);
			this.intervals.push(interval);
		});
	}

	private async setupInterval(guild: Guild, messageJob: any) {
		const dateDifference = messageJob.firstTimeSending - Date.now();
		let timeout;
		if (dateDifference > 0) {
			timeout = setTimeout(async () => {
				await this.sendMessageInterval(guild, messageJob);
			}, dateDifference);
		} else if (Math.abs(dateDifference) < messageJob.intervalTime) {
			timeout = setTimeout(async () => {
				await this.sendMessageInterval(guild, messageJob);
			}, messageJob.intervalTime - dateDifference);
		} else {
			await this.sendMessageInterval(guild, messageJob);
		}
		if (timeout) this.timeouts.push(timeout);
	}

	private async updateLastTimeSent(database: any) {}
}
