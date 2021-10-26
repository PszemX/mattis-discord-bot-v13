import { Message } from 'discord.js';
import BaseEvent from '../classes/BaseEvent';

export default class extends BaseEvent {
	static async execute(message: Message) {
		console.log(message.guild?.id);
	}
}
