import { Guild } from 'discord.js';
import { GuildCache } from '../../classes/GuildCache';
import { BaseJob } from '../../classes/BaseJob';
import { clearTimeout } from 'timers';
import { Mattis } from '../../classes/Mattis';

export class SendMessageJob extends BaseJob {
	public constructor() {
		super('sendMessageJob', 'job');
	}
	private intervals: NodeJS.Timeout[] = [];
	private timeouts: NodeJS.Timeout[] = [];
	private guildMessageJobs: any[] = [];

	public async execute(
		mattis: Mattis,
		guild: Guild,
		guildCache: GuildCache
	): Promise<void> {
		this.guildMessageJobs =
			guildCache.settings.actions.sendMessageJob.messageJobs;
		for (const messageJob of this.guildMessageJobs) {
			if (messageJob.enabled)
				await this.setupInterval(mattis, guild, messageJob);
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

	private async sendMessageInterval(
		mattis: Mattis,
		guild: Guild,
		messageJob: any
	) {
		const channel: any = guild.channels.cache.get(messageJob.channelId);
		const database: any = mattis.Database;
		await channel.send(messageJob.message).then(async () => {
			await this.updateLastTimeSent(database, guild, messageJob);
			var interval = setInterval(async () => {
				await channel.send(messageJob.message);
				await this.updateLastTimeSent(database, guild, messageJob);
			}, messageJob.intervalTime);
			this.intervals.push(interval);
		});
	}

	private async setupInterval(mattis: Mattis, guild: Guild, messageJob: any) {
		const dateDifference = messageJob.firstTimeSending - Date.now();
		let timeout;
		if (dateDifference > 0) {
			timeout = setTimeout(async () => {
				await this.sendMessageInterval(mattis, guild, messageJob);
			}, dateDifference);
		} else if (Math.abs(dateDifference) < messageJob.intervalTime) {
			timeout = setTimeout(async () => {
				await this.sendMessageInterval(mattis, guild, messageJob);
			}, messageJob.intervalTime - dateDifference);
		} else {
			await this.sendMessageInterval(mattis, guild, messageJob);
		}
		if (timeout) this.timeouts.push(timeout);
	}

	private async updateLastTimeSent(
		database: any,
		guild: Guild,
		messageJob: any
	) {
		const currentId = messageJob.id;
		this.guildMessageJobs.find((i) => i.id == currentId).lastTimeSent =
			Date.now();
		await database.guildsData(guild.id, 'settings').updateOne(
			{ id: guild.id },
			{
				$set: {
					'actions.sendMessageJob.messageJobs': this.guildMessageJobs,
				},
			}
		);
	}
}
