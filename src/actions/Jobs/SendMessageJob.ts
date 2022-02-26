import { Guild } from 'discord.js';
import { GuildCache } from '../../classes/GuildCache';
import { BaseJob } from '../../classes/BaseJob';

export class SendMessageJob extends BaseJob {
	public constructor() {
		super('sendMessageJob', 'job');
	}

	public async execute(guild: Guild, guildCache: GuildCache): Promise<void> {
		const guildMessageJobs =
			guildCache.settings.actions.sendMessageJob.messageJobs;
		for (const messageJob of guildMessageJobs) {
			if (messageJob.enabled) await this.setupInterval(guild, messageJob);
		}
	}

	private async sendMessageInterval(guild: Guild, messageJob: any) {
		const channel: any = guild.channels.cache.get(messageJob.channelId);
		await channel.send(messageJob.message).then(() => {
			setInterval(async () => {
				await channel.send(messageJob.message);
			}, messageJob.intervalTime);
		});
	}

	private async setupInterval(guild: Guild, messageJob: any) {
		const dateDifference = messageJob.firstTimeSending - Date.now();
		if (dateDifference > 0) {
			setTimeout(async () => {
				await this.sendMessageInterval(guild, messageJob);
			}, dateDifference);
		} else if (Math.abs(dateDifference) < messageJob.intervalTime) {
			setTimeout(async () => {
				await this.sendMessageInterval(guild, messageJob);
			}, messageJob.intervalTime - dateDifference);
		} else {
			await this.sendMessageInterval(guild, messageJob);
		}
	}
}
