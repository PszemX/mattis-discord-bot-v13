import { Mattis } from '../classes/Mattis';
import { Guild, Role } from 'discord.js';
import { parse, resolve } from 'path';
import { FFmpeg } from 'prism-media';
import { IEventData, IGuildCache } from '../typings';

export class ClientUtils {
	public constructor(public readonly client: Mattis) {}

	public async fetchMuteRole(guild: Guild): Promise<Role> {
		return (
			guild.roles.cache.find(
				(x) => x.name === this.client.config.muteRoleName
			) ??
			guild.roles.create({
				mentionable: false,
				name: this.client.config.muteRoleName,
				permissions: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
				reason: 'Create Muted role',
			})
		);
	}

	public async fetchDJRole(guild: Guild): Promise<Role> {
		return (
			guild.roles.cache.find((x) => x.name === this.client.config.djRoleName) ??
			guild.roles.create({
				mentionable: false,
				name: this.client.config.djRoleName,
				permissions: ['SEND_MESSAGES', 'CONNECT'],
				reason: 'Create DJ role',
			})
		);
	}

	public requiredVoters(memberAmount: number): number {
		return Math.round(memberAmount / 2);
	}

	public decode(string: string): string {
		return Buffer.from(string, 'base64').toString('ascii');
	}

	public async getUserCount(): Promise<number> {
		return this.client.guilds.cache.reduce(
			(membersSum: number, guild: Guild) => (membersSum += guild.memberCount),
			0
		);
		// let arr: string[] = [];
		// if (this.client.shard) {
		// 	const shardUsers = await this.client.shard.broadcastEval((c) =>
		// 		c.users.cache.map((x) => x.id)
		// 	);
		// 	for (const users of shardUsers) {
		// 		arr = arr.concat(users);
		// 	}
		// } else {
		// 	arr = this.client.users.cache.map((x) => x.id);
		// }
		// return arr.filter((x, i) => arr.indexOf(x) === i).length;
	}

	public async getChannelCount(textOnly = true): Promise<number> {
		let arr: string[] = [];

		if (this.client.shard) {
			const shardChannels = await this.client.shard.broadcastEval(
				(c, t) =>
					c.channels.cache
						.filter((ch) => {
							if (t)
								return (
									ch.type === 'GUILD_TEXT' ||
									ch.type === 'GUILD_PUBLIC_THREAD' ||
									ch.type === 'GUILD_PRIVATE_THREAD'
								);

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
					if (textOnly)
						return (
							ch.type === 'GUILD_TEXT' ||
							ch.type === 'GUILD_PUBLIC_THREAD' ||
							ch.type === 'GUILD_PRIVATE_THREAD'
						);

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

	public getFFmpegVersion(): string {
		try {
			const ffmpeg = FFmpeg.getInfo();
			return (
				ffmpeg.version
					.split(/_|-| /)
					.find((x) => /[0-9.]/.test(x))
					?.replace(/[^0-9.]/g, '') ?? 'Unknown'
			);
		} catch (e) {
			return 'Unknown';
		}
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
			? this.client.Guilds.guildsData.get(guildId)
			: 'guildless';
		const eventData = {
			mattis: this.client,
			guildCache,
			args: args.length > 1 ? args : args[0],
			timestamp: Date.now(),
		};
		return eventData;
	}
}
