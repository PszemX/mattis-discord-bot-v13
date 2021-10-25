import { Mattis } from './Mattis';
import { Guild, Role } from 'discord.js';
import { resolve, parse } from 'path';

export class ClientUtils {
	public constructor(public readonly client: Mattis) {}

	public requiredVoters(memberAmount: number): number {
		return Math.round(memberAmount / 2);
	}

	public decode(string: string): string {
		return Buffer.from(string, 'base64').toString('ascii');
	}

	public async getUserCount(): Promise<number> {
		let arr: string[] = [];

		if (this.client.shard) {
			const shardUsers = await this.client.shard.broadcastEval((c) =>
				c.users.cache.map((x) => x.id)
			);

			for (const users of shardUsers) {
				arr = arr.concat(users);
			}
		} else {
			arr = this.client.users.cache.map((x) => x.id);
		}

		return arr.filter((x, i) => arr.indexOf(x) === i).length;
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

	public async import<T>(path: string, ...args: any[]): Promise<T | undefined> {
		const file = await import(resolve(path)).then((m) => m[parse(path).name]);
		return file ? new file(...args) : undefined;
	}
}
