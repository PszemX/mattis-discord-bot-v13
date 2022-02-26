import { updateGuildsData } from '../utilities/updateGuildsData';
import { Collection } from 'discord.js';
import { Mattis } from './Mattis';
import { GuildCache } from './GuildCache';

export class GuildsManager extends Collection<string, any> {
	public constructor(public readonly Mattis: Mattis) {
		super();
	}

	public async loadGuildsData() {
		// Stworzenie guildsData dla każdego serwera w bazie danych.
		const databaseGuildIds = await this.Mattis.Database.guildNamesList();

		for (const guildId of databaseGuildIds) {
			this.updateGuildsData(guildId);
		}
	}

	public async updateGuildsData(guildId: string) {
		const guildSettings = await this.Mattis.Database.guildsData(
			guildId,
			'settings'
		).findOne({
			id: guildId,
		});
		return this.set(
			guildId,
			await updateGuildsData(this.Mattis, guildSettings)
		);
	}

	public async runJobs() {
		for (const guildCache of this.values()) {
			await this.runJob(guildCache);
		}
	}

	public async runJob(guildCache: GuildCache) {
		if (guildCache.jobs) await guildCache.jobs.run();
	}
}
