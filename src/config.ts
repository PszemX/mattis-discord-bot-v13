import {
	ClientOptions,
	Intents,
	Options,
	LimitedCollection,
	ClientPresenceStatus,
} from "discord.js";

export const discordToken =
	process.env.ENVIRONMENT === "production"
		? process.env.DISCORD_PRODUCTION_TOKEN
		: process.env.DISCORD_DEVELOPMENT_TOKEN;

export const owners: string[] = JSON.parse(process.env.OWNERS ?? "[]");
export const defaultPrefix: string = String(process.env.DEFAULT_PREFIX);
export const isProd: Boolean = process.env.ENVIRONMENT === "production";
export const isDev: Boolean = !isProd;

export const clientOptions: ClientOptions = {
	allowedMentions: { parse: ["users"], repliedUser: true },
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
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
		{ name: `My default prefix is ${defaultPrefix}`, type: "PLAYING" },
		{ name: "music with {users.size} users", type: "LISTENING" },
		{
			name: "{textChannels.size} of text channels in {guilds.size} guilds",
			type: "WATCHING",
		},
		{ name: "Hello there, my name is {username}", type: "PLAYING" },
		{ name: "Hello world", type: "COMPETING" },
	],
	status: ["online"] as ClientPresenceStatus[],
	interval: 60000,
};
