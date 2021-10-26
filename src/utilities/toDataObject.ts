import DiscordJS from 'discord.js';
import guildsCache from './loadGuildsCache';

const messageToData = async (message: DiscordJS.Message) => {
	if (!message.guildId) return null;
	const guildCache = guildsCache()[message.guildId] || null;
	console.log(guildCache);
	if (!guildCache) return null;
	const data = {
		guildCache,
		guild: message.guild,
		member: message.member,
		channel: message.channel,
		user: message.author,
		message,
		messageContent: message.content,
		timestamp: null,
	};
	return data;
};

export default messageToData;
