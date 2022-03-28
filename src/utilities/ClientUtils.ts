import { Guild } from 'discord.js';
import { parse, resolve } from 'path';
import { IEventData } from '../typings';
import { Mattis } from '../classes/Mattis';

export class ClientUtils {
	public constructor(public readonly client: Mattis) {}

	public async getUserCount(): Promise<number> {
		let membersCount: number = 0;
		if (this.client.shard) {
			const shardGuildsMembers = await this.client.shard.broadcastEval((c) =>
				c.guilds.cache.map((g) => g.memberCount)
			);
			for (const shard of shardGuildsMembers) {
				membersCount += shard.reduce(
					(membersSum: number, members: number) => membersSum + members,
					0
				);
			}
		} else {
			return this.client.guilds.cache.reduce(
				(membersSum: number, guild: Guild) => (membersSum += guild.memberCount),
				0
			);
		}
		return membersCount;
	}

	public async getChannelCount(textOnly = true): Promise<number> {
		let arr: string[] = [];

		if (this.client.shard) {
			const shardChannels = await this.client.shard.broadcastEval(
				(c, t) =>
					c.channels.cache
						.filter((ch) => {
							if (t) {
								return (
									ch.type === 'GUILD_TEXT' ||
									ch.type === 'GUILD_PUBLIC_THREAD' ||
									ch.type === 'GUILD_PRIVATE_THREAD'
								);
							}

							return true;
						})
						.map((ch) => ch.id),
				{
					context: textOnly,
				}
			);

			for (const channels of shardChannels) {
				arr = arr.concat(channels);
			}
		} else {
			arr = this.client.channels.cache
				.filter((ch) => {
					if (textOnly) {
						return (
							ch.type === 'GUILD_TEXT' ||
							ch.type === 'GUILD_PUBLIC_THREAD' ||
							ch.type === 'GUILD_PRIVATE_THREAD'
						);
					}

					return true;
				})
				.map((ch) => ch.id);
		}

		return arr.filter((x, i) => arr.indexOf(x) === i).length;
	}

	public async getGuildCount(): Promise<number> {
		if (this.client.shard) {
			const guilds = await this.client.shard.broadcastEval(
				(c) => c.guilds.cache.size
			);

			return guilds.reduce((prev, curr) => prev + curr);
		}

		return this.client.guilds.cache.size;
	}

	public async getPlayingCount(): Promise<number> {
		if (this.client.shard) {
			const playings = await this.client.shard.broadcastEval(
				(c) => c.guilds.cache.filter((x) => x.queue?.playing === true).size
			);

			return playings.reduce((prev, curr) => prev + curr);
		}

		return this.client.guilds.cache.filter((x) => x.queue?.playing === true)
			.size;
	}

	public async import<T>(path: string, ...args: any[]): Promise<T | undefined> {
		const file = await import(resolve(path)).then((m) => m[parse(path).name]);
		return file ? new file(...args) : undefined;
	}

	public getEventData(...args: any): IEventData {
		for (const arg of args) {
			if (arg?.guildId || arg?.guild?.id || arg?.message?.guildId) {
				var guildId = arg?.guildId || arg?.guild?.id || arg?.message?.guildId;
				break;
			}
		}
		// 'guildless' guildCache is for events without guild e.g. 'onReady' event.
		const guildCache: IEventData['guildCache'] = guildId
			? this.client.Guilds.get(guildId)
			: 'guildless';
		return {
			mattis: this.client,
			guildCache,
			args: args.length > 1 ? args : args[0],
			timestamp: Date.now(),
		};
	}

	public async fetchGuild(guildId: string): Promise<Guild | null> {
		if (this.client.shard) {
			const guilds = await this.client.shard.broadcastEval(
				(c, id) => c.guilds.cache.get(id),
				{
					context: guildId,
				}
			);

			return (guilds as (Guild | null)[]).find((guilds) => !!guilds) || null;
		} else {
			return this.client.guilds.cache.get(guildId) || null;
		}
	}
}
