import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class SameMessagesProtectionAction extends BaseEventAction {
	public constructor() {
		super('sameMessagesProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		return false;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
