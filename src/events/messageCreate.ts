import { Message } from "discord.js";

export const execute = (message: Message) => {
	console.log(message.guild?.id);
};
