import { Message } from 'discord.js';
import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class SameMessagesProtectionAction extends BaseEventAction {
	public constructor() {
		super('sameMessagesProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message: Message = EventData.args;
		const { channel } = message;
		if (message.content.length < settings.minMessageLength) return false;
		EventData.guildCache.cacheManager
			.getChannelCache(channel)
			.sameMessagesProtection.push(message);
		const lastChannelMessages = EventData.guildCache.cacheManager
			.getChannelCache(channel)
			.sameMessagesProtection.filter(
				(msg: Message) =>
					Date.now() - msg.createdTimestamp < settings.perMilisecondsTime &&
					msg.content === message.content
			);
		return lastChannelMessages.length > settings.maxAmount;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
