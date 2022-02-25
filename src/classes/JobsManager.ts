import { IAction, ICommand, IEventData } from '../typings';
import { GuildCache } from './GuildCache';
import { Collection } from 'discord.js';
import { Mattis } from './Mattis';
import { BaseJob } from './BaseJob';

export class JobsManager {
	public constructor(public Mattis: Mattis, public guildCache: GuildCache) {}

	public async run(): Promise<void> {
		const guildId = this.guildCache.settings.id;
		const guild = this.Mattis.guilds.cache.get(guildId);
		for (const job of this.guildCache.actionsByEvent.job) {
			job.execute(guild, this.guildCache);
		}
	}
}
