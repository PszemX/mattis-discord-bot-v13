import {
	Channel, Collection, GuildMember
} from 'discord.js';
import { guildCacheLastDuration, guildCacheLastInterval } from '../../config';
import { IChannelCache, IMemberCache } from '../../typings';

export class CacheManager {
	public membersCache: Collection<string, any> = new Collection();
	public channelsCache: Collection<string, any> = new Collection();
	super() {}

	public getMemberCache(member: GuildMember) {
		if (!member) return null;
		if (!this.membersCache.get(member.id)) {
			const emptyMemberCache: IMemberCache = {
				channelsChangingProtection: [],
				spamProtection: [],
				linksProtection: [],
				massPingProtection: [],
				badWordsProtection: []
			};
			this.membersCache.set(member.id, emptyMemberCache);
		}
		return this.membersCache.get(member.id);
	}

	public getChannelCache(channel: Channel) {
		if (!channel) return null;
		if (!this.membersCache.get(channel.id)) {
			const emptyChannelCache: IChannelCache = {
				sameMessagesProtection: [],
			};
			this.channelsCache.set(channel.id, emptyChannelCache);
		}
		return this.membersCache.get(channel.id);
	}

	// public cleanCaches() {
	// 	setInterval(() => {
	//         for(const memberCache of this.membersCache){
	//
	//         }
	//         for(const channelCache of this.channelsCache){
	//
	//         }
	// 	}, guildCacheLastInterval);
	// }
}