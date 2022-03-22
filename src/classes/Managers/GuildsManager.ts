import { Collection, Guild } from 'discord.js';
import { updateGuildsData } from '../../utilities/updateGuildsData';
import { Mattis } from '../Mattis';
import { GuildCache } from '../GuildCache';
import { guildDataModel } from '../../models/guildData';

export class GuildsManager extends Collection<string, any> {
	public constructor(public readonly Mattis: Mattis) {
		super();
	}

	public async loadGuildsData() {
		// Stworzenie guildsData dla każdego serwera w bazie danych.
		const databaseGuildIds = await this.Mattis.Database.guildNamesList();

		for (const guildId of databaseGuildIds) {
			await this.updateDatabaseGuildSettings(guildId);
			this.updateGuildsData(guildId);
		}
	}

	public async updateGuildsData(guildId: string) {
		if (this.Mattis.Guilds.get(guildId)) {
			this.clearJob(this.Mattis.Guilds.get(guildId));
		}
		const guildSettings = await this.Mattis.Database.guildSettings(guildId);
		const guildCache = await updateGuildsData(this.Mattis, guildSettings);
		this.set(guildId, guildCache);
		await this.runJob(guildCache);
	}

	public async updateDatabaseGuildSettings(guildId: string) {
		const guildSettings = await this.Mattis.Database.guildSettings(guildId);
		const fetchedGuild: Guild | null = await this.Mattis.utils.fetchGuild(
			guildId
		);
		const updatedGuildSettings = this.updateObject(
			guildSettings,
			guildDataModel(fetchedGuild)
		);
		await this.Mattis.Database.guildsData(guildId, 'settings').replaceOne(
			{ id: guildId },
			updatedGuildSettings
		);
	}

	private updateObject(objectOne: any, objectTwo: any) {
		// Based on whole guildsData.ts object.
		let changed: any = {};
		for (const key in objectTwo) {
			if (Array.isArray(objectTwo[key])) {
				changed[key] =
					objectOne[key] == undefined ? objectTwo[key] : objectOne[key];
			} else if (typeof objectTwo[key] === 'object') {
				if (objectOne[key] == undefined) {
					changed[key] = objectTwo[key];
				} else {
					changed[key] = this.updateObject(objectOne[key], objectTwo[key]);
				}
			} else {
				changed[key] =
					objectOne[key] == undefined ? objectTwo[key] : objectOne[key];
			}
		}
		// // Based only on new things in settings.
		// let changed: any = objectOne;
		// const comparison: any = addedDiff(objectOne, objectTwo);
		// for (const key in comparison) {
		// 	if (typeof comparison[key] === 'object') {
		// 		if (objectOne[key] == undefined) objectOne[key] = {};
		// 		changed[key] = this.changedObject(objectOne[key], objectTwo[key]);
		// 	} else {
		// 		changed[key] = comparison[key];
		// 	}
		// }
		return changed;
	}

	private async runJob(guildCache: GuildCache) {
		if (guildCache.jobs) await guildCache.jobs.run();
	}

	private async clearJob(guildCache: GuildCache) {
		if (guildCache.jobs) await guildCache.jobs.clear();
	}
}
