import { Guild } from 'discord.js';
import { defaultPrefix, baseLanguage } from '../config';

export const guildDataModel = (guild: Guild) => {
	return {
		id: guild.id,
		name: guild.name,
		prefix: defaultPrefix,
		language: baseLanguage,
		actions: {},
	};
};
