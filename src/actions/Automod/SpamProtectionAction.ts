import { GuildMember, Message } from 'discord.js';
import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class SpamProtectionAction extends BaseEventAction {
	public constructor() {
		super('spamProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message = EventData.args;
		const { member } = message;
		EventData.guildCache.cacheManager.getMemberCache(member).spamProtection.push(message);
		return (
			EventData.guildCache.cacheManager.getMemberCache(member).spamProtection.filter(
				(cachedMessage: Message) => Date.now() - cachedMessage.createdTimestamp < settings.perMilisecondsTime,
			).length > settings.maxMessages
		);
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
