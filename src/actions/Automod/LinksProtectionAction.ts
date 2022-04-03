import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class LinksProtectionAction extends BaseEventAction {
	public constructor() {
		super('linksProtection', 'messageCreate');
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
