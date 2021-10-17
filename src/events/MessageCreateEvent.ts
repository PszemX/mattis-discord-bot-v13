import { Message } from 'discord.js';

export class MessageCreateEvent {
	public name = 'messageCreate';

	public constructor() {}

	public async execute(message: Message) {
		console.log(message.guild?.id);
	}
}
