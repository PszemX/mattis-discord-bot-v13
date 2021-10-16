import { Message } from 'discord.js';

module.exports = {
	name: 'messageCreate',
	execute: (message: Message) => {
		console.log(message.guild?.id);
	},
};
