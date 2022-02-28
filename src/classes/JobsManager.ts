import { GuildCache } from './GuildCache';
import { Mattis } from './Mattis';

export class JobsManager {
	public constructor(public Mattis: Mattis, public guildCache: GuildCache) {}

	public async run(): Promise<void> {
		const guildId = this.guildCache.settings.id;
		const guild = this.Mattis.guilds.cache.get(guildId);
		for (const job of this.guildCache.actionsByEvent.job) {
			job.execute(guild, this.guildCache);
		}
	}

	public async clear(): Promise<void> {
		for (const job of this.guildCache.actionsByEvent.job) {
			job.clear();
		}
	}
}
