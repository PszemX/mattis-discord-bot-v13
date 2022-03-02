import {
	ClientOptions,
	Intents,
	Options,
	LimitedCollection,
	ClientPresenceStatus,
	ActivityType,
} from 'discord.js';
import { IpresenceData } from './typings/enum';

// const allIntents = new Intents(32767);
export const clientOptions: ClientOptions = {
	allowedMentions: { parse: ['users'], repliedUser: true },
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING,
	],
	makeCache: Options.cacheWithLimits({
		MessageManager: {
			maxSize: Infinity,
			sweepInterval: 300,
			sweepFilter: LimitedCollection.filterByLifetime({
				lifetime: 10800,
			}),
		},
		ThreadManager: {
			maxSize: Infinity,
			sweepInterval: 300,
			sweepFilter: LimitedCollection.filterByLifetime({
				lifetime: 10800,
				getComparisonTimestamp: (e) => e.archiveTimestamp!,
				excludeFromSweep: (e) => !e.archived,
			}),
		},
	}),
	retryLimit: 3,
};
export const owners: string[] = JSON.parse(process.env.OWNERS ?? '[]');
export const defaultPrefix: string = String(process.env.DEFAULT_PREFIX);
export const isProd: Boolean = process.env.ENVIRONMENT === 'production';
export const isDev: Boolean = !isProd;
export const baseLanguage: string = String(process.env.BASE_LANGUAGE);
export const guildCacheLastDuration: Number = Number(
	process.env.GUILDCACHE_LAST_DURATION
);
export const guildCacheLastInterval: number =
	Number(process.env.GUILDCACHE_LAST_INTERVAL) || 60000;
export const commandsCooldown: Number = Number(process.env.COMMANDS_COOLDOWN);
export const clientId: string = String(process.env.CLIENT_ID);
export const djRoleName = process.env.DJ_ROLE_NAME! || 'DJ';
export const muteRoleName = process.env.MUTE_ROLE_NAME! || 'Muted';
export const yesEmoji = process.env.YES_EMOJI! || '✅';
export const noEmoji = process.env.NO_EMOJI! || '❌';
export const streamStrategy = process.env.STREAM_STRATEGY! || 'youtube-dl';

export const presenceData: IpresenceData = {
	activities: (JSON.parse(process.env.ACTIVITIES! || '[]') as string[]).map(
		(x, i) => ({
			name: x,
			type: ((JSON.parse(process.env.ACTIVITY_TYPES! || '[]') as string[])[
				i
			]?.toUpperCase() || 'PLAYING') as Exclude<ActivityType, 'CUSTOM'>,
		})
	),
	status: ['online'] as ClientPresenceStatus[],
	interval: 60000,
};
