import {
	ClientOptions,
	Intents,
	Options,
	LimitedCollection,
	ClientPresenceStatus,
} from 'discord.js';

export const discordToken =
	process.env.ENVIRONMENT === 'production'
		? process.env.DISCORD_PRODUCTION_TOKEN
		: process.env.DISCORD_DEVELOPMENT_TOKEN;

export const mongoUri = process.env.MONGO_URI ?? '';
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

export const presenceData: any /*IpresenceData*/ = {
	activities: [
		{ name: `My default prefix is ${defaultPrefix}`, type: 'PLAYING' },
		{ name: '@M.A.T.T.I.S', type: 'LISTENING' },
		{ name: '{users.count} users', type: 'WATCHING' },
		{ name: 'Hello there, my name is M.A.T.T.I.S', type: 'PLAYING' },
		{ name: 'Wanna be my friend?', type: 'COMPETING' },
	],
	status: ['online'] as ClientPresenceStatus[],
	interval: 300000,
};
