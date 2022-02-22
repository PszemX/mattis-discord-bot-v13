import { updateGuildsData } from '../utilities/updateGuildsData';
import { Collection } from 'discord.js';
import { Mattis } from './Mattis';

export class GuildsManager extends Collection<string, any> {
	public constructor(public readonly Mattis: Mattis) {
		super();
	}

	public async loadGuildsData() {
		// Stworzenie guildsData dla każdego serwera w bazie danych.
		const databaseGuildIds = (
			await this.Mattis.Database.db('guildsData').listCollections().toArray()
		).map((u) => u.name);
		for (const guildId of databaseGuildIds) {
			const guildSettings = await this.Mattis.Database.guildsData(
				'settings'
			).findOne({
				id: guildId,
			});
			if (guildId != 'settings') {
				this.updateGuildsData(guildId, guildSettings);
			}
		}
	}

	public async updateGuildsData(guildId: string, guildSettings: any) {
		return this.set(
			guildId,
			await updateGuildsData(this.Mattis, guildSettings)
		);
	}
}
