import { Guild } from 'discord.js';
import { defaultPrefix, baseLanguage } from '../../config';
import { Mattis } from '../../classes/Mattis';

const guildAddToDatabase = async (guild: Guild, Mattis: Mattis) => {
	const guildDataSchema = {
		id: guild.id,
		name: guild.name,
		prefix: defaultPrefix,
		language: baseLanguage,
		actions: {
			welcomeChannelMessage: {
				enabled: false,
				channelId: '720266754139357185',
				text: 'Witaj na serwerze!',
			},
			welcomePrivateMessage: {
				enabled: false,
				text: 'Witaj na serwerze Neon Vibe!',
			},
			ping: {
				enabled: false,
				triggers: ['ping'],
				cooldown: 3000,
			},
			covid: {
				enabled: false,
				triggers: ['covid'],
			},
		},
	};
	Mattis.Database.db('guildsData')
		.collection('settings')
		.insertOne(guildDataSchema)
		.catch((error) => {
			Mattis.Database.log.error(error);
		});
};

export { guildAddToDatabase };
