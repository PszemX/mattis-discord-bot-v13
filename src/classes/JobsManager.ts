import { IAction, ICommand, IEventData } from '../typings';
import { GuildCache } from './GuildCache';
import { Collection } from 'discord.js';
import { Mattis } from './Mattis';

export class JobsManager {
	public constructor(public Mattis: Mattis, public guildCache: GuildCache) {}

	public async run(): Promise<void> {}
}
