import { Message } from 'discord.js';

const event = async (message: Message): Promise<void> => {
	console.log(message);
};

export default event;
