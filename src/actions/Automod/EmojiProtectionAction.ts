import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class EmojiProtectionAction extends BaseEventAction {
	public constructor() {
		super('emojiProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const { member } = EventData.args;
		const cachedMessages =
			EventData.guildCache.cacheManager.getMemberCache(member).messages;
		return cachedMessages[0].emojis > settings.maxPercentage;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
