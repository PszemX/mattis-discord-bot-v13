import { guildsCache } from './guildsCache';
import { GuildMember, TextChannel } from 'discord.js';
import * as config from '../config';

const membersToCleanCache = new Set<GuildMember>();
const channelsToCleanCache = new Set<TextChannel>();

const getMemberCache = (member: GuildMember) => {
	if (!member) return null;
	if (!guildsCache[member.guild.id]) return null;
	if (!guildsCache[member.guild.id].membersCache[member.id])
		guildsCache[member.guild.id].membersCache[member.id] = {
			channelsChangingProtection: [],
			spamProtection: [],
			linksProtection: [],
			massPingProtection: [],
			badWordsProtection: [],
		};
	membersToCleanCache.add(member);
	return guildsCache[member.guild.id].membersCache[member.id];
};

const getChannelCache = (channel: TextChannel) => {
	if (!guildsCache[channel.guild.id]) return null;
	if (!guildsCache[channel.guild.id].channelsCache[channel.id])
		guildsCache[channel.guild.id].channelsCache[channel.id] = {
			sameMessagesProtection: [],
		};
	channelsToCleanCache.add(channel);
	return guildsCache[channel.guild.id].channelsCache[channel.id];
};

setInterval(() => {
	for (let member of membersToCleanCache) {
		let memberCache = guildsCache[member.guild.id].membersCache[member.id];
		while (memberCache.channelsChangingProtection.length) {
			if (
				Date.now() - memberCache.channelsChangingProtection[0].time >
				config.guildCacheLastDuration
			) {
				memberCache.channelsChangingProtection.shift();
			} else break;
		}
		while (memberCache.spamProtection.length) {
			if (
				Date.now() - memberCache.spamProtection[0].createdTimestamp >
				config.guildCacheLastDuration
			) {
				memberCache.spamProtection.shift();
			} else break;
		}
		while (memberCache.linksProtection.length) {
			if (
				Date.now() - memberCache.linksProtection[0].createdTimestamp >
				config.guildCacheLastDuration
			) {
				memberCache.linksProtection.shift();
			} else break;
		}
		while (memberCache.massPingProtection.length) {
			if (
				Date.now() - memberCache.massPingProtection[0].createdTimestamp >
				config.guildCacheLastDuration
			) {
				memberCache.massPingProtection.shift();
			} else break;
		}
		while (memberCache.badWordsProtection.length) {
			if (
				Date.now() - memberCache.badWordsProtection[0].createdTimestamp >
				config.guildCacheLastDuration
			) {
				memberCache.badWordsProtection.shift();
			} else break;
		}
		if (
			memberCache.channelsChangingProtection.length == 0 &&
			memberCache.spamProtection.length == 0 &&
			memberCache.linksProtection.length == 0 &&
			memberCache.massPingProtection.length == 0 &&
			memberCache.linksProtection.length == 0 &&
			memberCache.badWordsProtection.length == 0
		) {
			delete guildsCache[member.guild.id].membersCache[member.id];
			membersToCleanCache.delete(member);
		}
	}
	for (let channel of channelsToCleanCache) {
		let channelCache = guildsCache[channel.guild.id].channelsCache[channel.id];
		while (channelCache.sameMessagesProtection.length) {
			if (
				Date.now() - channelCache.sameMessagesProtection[0].createdTimestamp >
				config.guildCacheLastDuration
			) {
				channelCache.sameMessagesProtection.shift();
			} else break;
		}
		if (channelCache.sameMessagesProtection.length == 0) {
			delete guildsCache[channel.guild.id].channelsCache[channel.id];
			channelsToCleanCache.delete(channel);
		}
	}
}, config.guildCacheLastInterval);

export { getMemberCache, getChannelCache };
