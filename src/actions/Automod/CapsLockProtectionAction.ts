import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class CapsLockProtectionAction extends BaseEventAction {
	public constructor() {
		super('capsLockProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const { member } = EventData.args;
		// Cached messages only including badwords written in set time.
		const cachedMessages =
			EventData.guildCache.cacheManager.getMemberCache(member).messages;
		return cachedMessages[0].capslock > settings.maxPercentage;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
