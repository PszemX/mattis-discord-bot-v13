import { Channel, Collection, GuildMember } from 'discord.js';
import { guildCacheLastDuration } from '../../config';
import { IChannelCache, IMemberCache } from '../../typings';

export class CacheManager {
	public membersCache: Collection<string, IMemberCache> = new Collection();
	public channelsCache: Collection<string, IChannelCache> = new Collection();

	public getMemberCache(member: GuildMember) {
		if (!member) return null;
		if (!this.membersCache.get(member.id)) {
			const emptyMemberCache: IMemberCache = {
				messages: [],
				voiceStates: [],
			};
			this.membersCache.set(member.id, emptyMemberCache);
		}
		return this.membersCache.get(member.id);
	}

	public getChannelCache(channel: Channel) {
		if (!channel) return null;
		if (!this.channelsCache.get(channel.id)) {
			const emptyChannelCache: IChannelCache = {
				messages: [],
			};
			this.channelsCache.set(channel.id, emptyChannelCache);
		}
		return this.channelsCache.get(channel.id);
	}

	public cleanCaches() {
		for (const memberId of this.membersCache.keys()) {
			if (this.membersCache.has(memberId)) {
				console.log(this.membersCache.get(memberId));
				// @ts-ignore
				for (const cache of Object.keys(this.membersCache.get(memberId))) {
					// @ts-ignore
					this.membersCache.get(memberId)[cache] = this.membersCache
						.get(memberId)
						[cache].filter(
							(cacheData: string) =>
								Date.now() - Number(cacheData.split('.').at(-1)) <
								guildCacheLastDuration
						);
				}
			}
		}
		for (const channelId of this.channelsCache.keys()) {
			if (this.channelsCache.has(channelId)) {
				// @ts-ignore
				for (const cache of Object.keys(this.channelsCache.get(channelId))) {
					// @ts-ignore
					this.channelsCache.get(channelId)[cache] = this.channelsCache
						.get(channelId)
						[cache].filter(
							(cacheData: string) =>
								Date.now() - Number(cacheData.split('.').at(-1)) <
								guildCacheLastDuration
						);
				}
			}
		}
	}
}
