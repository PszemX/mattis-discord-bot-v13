import { Guild } from 'discord.js';
import { BaseEvent } from '../classes/BaseEvent';
import { guildDataModel } from '../models/guildData';

export class GuildCreateEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'guildCreate');
	}

	public async execute(guild: Guild): Promise<void> {
		await this.mattis.Database.guildsData('settings').insertOne(
			guildDataModel(guild)
		);
	}
}
