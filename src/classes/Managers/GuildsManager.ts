import { Collection, Guild } from 'discord.js';
import { guildDataKeysUpdateRequest } from '../../utilities/guildDataUpdatedKeys';
import { guildDataDefaultModel } from '../../models/guildDataDefault';
import { updateGuildsData } from '../../utilities/updateGuildsData';
import { IGuildSettings } from '../../typings';
import { GuildCache } from '../GuildCache';
import { Mattis } from '../Mattis';

export class GuildsManager extends Collection<string, any> {
	public constructor(public readonly Mattis: Mattis) {
		super();
	}

	public async loadGuildsData() {
		const databaseGuildIds = await this.Mattis.Database.guildNamesList();

		for (const guildId of databaseGuildIds) {
			await this.updateDatabaseGuildSettings(guildId);
			await this.updateGuildsData(guildId);
		}
	}

	public async updateGuildsData(guildId: string) {
		if (this.Mattis.Guilds.get(guildId)) {
			await GuildsManager.clearJob(this.Mattis.Guilds.get(guildId));
		}
		const guildSettings = await this.Mattis.Database.guildSettings(guildId);
		const guildCache = await updateGuildsData(this.Mattis, guildSettings);
		this.set(guildId, guildCache);
		await GuildsManager.runJob(guildCache);
	}

	public async updateDatabaseGuildSettings(guildId: string) {
		const guildSettings = await this.Mattis.Database.guildSettings(guildId);
		const fetchedGuild: Guild | null = await this.Mattis.utils.fetchGuild(
			guildId
		);
		const updatedGuildSettings = this.updateObject(
			guildSettings,
			guildDataDefaultModel(fetchedGuild)
		);
		// console.log(updatedGuildSettings);
		await this.Mattis.Database.guildsData(guildId, 'settings').replaceOne(
			{ id: guildId },
			updatedGuildSettings
		);
	}

	private updateObject(actualObject: any, expectedObject: IGuildSettings) {
		// Update key names for guild settings.
		const modifiedActualObject: IGuildSettings = this.updateObjectKeyNames(
			actualObject,
			guildDataKeysUpdateRequest
		);

		// Update other guild settings entires (add or remove).
		const updatedObject: IGuildSettings = this.updateObjectEntries(
			modifiedActualObject,
			expectedObject
		);
		return updatedObject;
	}

	private updateObjectKeyNames(
		actualObject: IGuildSettings,
		requestedModifications: any[]
	) {
		let modifiedActualObject: IGuildSettings = { ...actualObject };
		for (const request of Object.values(requestedModifications)) {
			modifiedActualObject = {
				...this.changeKeyName(modifiedActualObject, request),
			};
		}
		return modifiedActualObject;
	}

	private changeKeyName(
		actualObject: IGuildSettings,
		request: IGuildSettings
	): IGuildSettings {
		const changedActualObject = { ...actualObject };
		for (const key in request) {
			if (changedActualObject[key]) {
				if (typeof request[key] === 'object' && !Array.isArray(request[key])) {
					changedActualObject[key] = {
						...this.changeKeyName(changedActualObject[key], request[key]),
					};
				} else {
					changedActualObject[request[key]] = changedActualObject[key];
					delete changedActualObject[key];
				}
			}
		}
		return changedActualObject;
	}

	private updateObjectEntries(
		actualObject: IGuildSettings,
		expectedObject: IGuildSettings
	) {
		const updatedObject: IGuildSettings = {};
		for (const key in expectedObject) {
			if (
				typeof expectedObject[key] === 'object' &&
				!Array.isArray(expectedObject[key])
			) {
				if (actualObject[key] == undefined) {
					updatedObject[key] = expectedObject[key];
				} else {
					updatedObject[key] = this.updateObjectEntries(
						actualObject[key],
						expectedObject[key]
					);
				}
			} else {
				updatedObject[key] =
					actualObject[key] == undefined
						? expectedObject[key]
						: actualObject[key];
			}
		}
		return updatedObject;
	}

	private static async runJob(guildCache: GuildCache) {
		if (guildCache.jobs) await guildCache.jobs.run();
	}

	private static async clearJob(guildCache: GuildCache) {
		if (guildCache.jobs) await guildCache.jobs.clear();
	}
}
