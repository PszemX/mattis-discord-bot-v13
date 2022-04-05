import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';
import { Message } from 'discord.js';

export class SameMessagesProtectionAction extends BaseEventAction {
	public constructor() {
		super('sameMessagesProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message: Message = EventData.args;
		if (message.content.length < settings.minMessageLength) return false;
		const lastChannelMessages = EventData.guildCache.cacheManager
			.getChannelCache(message.channel)
			.sameMessagesProtection.filter(
				(msg: Message) =>
					Date.now() - msg.createdTimestamp < settings.perMilisecondsTime
			);
		let result = 0;
		for (let i = lastChannelMessages.length - 2; i >= 0; --i) {
			if (lastChannelMessages[i].content == message.content) ++result;
			else break;
		}

		return result > settings.maxAmount;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
