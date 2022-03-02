import { Guild } from 'discord.js';
import { GuildCache } from './GuildCache';
import { IJob } from '../typings';
import { Mattis } from './Mattis';

export abstract class BaseJob implements IJob {
	public constructor(
		public readonly name: IJob['name'],
		public readonly event: IJob['event'] // public readonly meta: ICommand['meta']
	) {}

	public abstract execute(
		mattis: Mattis,
		guild: Guild,
		guildCache: GuildCache
	): Promise<void>;
}
