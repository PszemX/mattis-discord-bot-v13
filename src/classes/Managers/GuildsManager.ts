import { Collection } from 'discord.js';
import { updateGuildsData } from '../../utilities/updateGuildsData';
import { Mattis } from '../Mattis';
import { GuildCache } from '../GuildCache';

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
		if (this.Mattis.Guilds.get(guildId)) {
			this.clearJob(this.Mattis.Guilds.get(guildId));
		}
		const guildSettings = await this.Mattis.Database.guildsData(
			guildId,
			'settings'
		).findOne({
			id: guildId,
		});
		const guildCache = await updateGuildsData(this.Mattis, guildSettings);
		this.set(guildId, guildCache);
		await this.runJob(guildCache);
	}

	private async runJob(guildCache: GuildCache) {
		if (guildCache.jobs) await guildCache.jobs.run();
	}

	private async clearJob(guildCache: GuildCache) {
		if (guildCache.jobs) await guildCache.jobs.clear();
	}
}
