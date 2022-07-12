import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { ICachedMessageData, IEventData } from '../../typings';

export class BadwordsProtectionAction extends BaseEventAction {
	public constructor() {
		super('badwordsProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const { member } = EventData.args;
		const messageMemberCache =
			EventData.guildCache.cacheManager.getMemberCache(member);
		const cachedMessages = messageMemberCache.messages;
		const maxBadwordsPerMessage = settings.maxBadwordsAmountPerMessage;
		// Check if last member's message contains less badwords than allowed.
		if (cachedMessages.at(-1).badwords.length > maxBadwordsPerMessage) {
			return true;
		}
		// Check if member's messages in time limit contains less badwords than allowed.
		const filteredCache = cachedMessages.filter(
			(cacheData: ICachedMessageData) =>
				Date.now() - cacheData.timestamp < settings.milisecondsTimeLimit
		);
		const badwordsSum = filteredCache.reduce(
			(amount: number, cacheData: ICachedMessageData) => {
				const badwordsAmount = cacheData.badwords.length;
				return amount + badwordsAmount;
			},
			0
		);
		return badwordsSum > settings.maxBadwordsAmountPerTime;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const { member } = EventData.args;
		// Kara
		// await EventData.mattis.utils.punishMember(settings, member);
		// await EventData.mattis.utils.responseMember(settings, member);
		// EventData.guildCache.cacheManager.getMemberCache(member).messages.pop();
		// await EventData.mattis.utils.logAction(settings, member);
	}
}
