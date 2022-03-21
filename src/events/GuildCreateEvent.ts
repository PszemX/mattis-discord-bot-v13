import { Guild } from 'discord.js';
import { BaseEvent } from '../classes/BaseStructures/BaseEvent';
import { guildDataModel } from '../models/guildData';

export class GuildCreateEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'guildCreate');
	}

	public async execute(guild: Guild): Promise<void> {
		if (await this.checkGuildDatabaseExistance(guild.id)) return;
		await this.mattis.Database.guildsData(guild.id, 'settings')
			.insertOne(guildDataModel(guild))
			.then(() => {
				this.mattis.Guilds.updateGuildsData(guild.id);
				this.mattis.Logger.debug(`Serwer ${guild.id} dodany do bazy danych.`);
			});
	}

	private async checkGuildDatabaseExistance(guildId: string) {
		const guildsNames = await this.mattis.Database.guildNamesList();
		return guildsNames.includes(guildId);
	}
}
