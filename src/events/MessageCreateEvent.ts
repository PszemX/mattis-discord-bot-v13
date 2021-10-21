import { Message } from 'discord.js';
import { BaseEvent } from '../classes/BaseEvent';
import { DefineEvent } from '../utilities/decorators/DefineEvent';

@DefineEvent('messageCreate')
export class MessageCreateEvent extends BaseEvent {
	public async execute(message: Message) {
		console.log(message.guild?.id);
	}
}
