import latinize from 'latinize';
import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import badwords from '../../utilities/badwords.json';
import { IEventData } from '../../typings';

export class BadwordsProtectionAction extends BaseEventAction {
	public constructor() {
		super('badwordsProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message = latinize(EventData.args.content.toLowerCase());
		const { length } = message;
		return false;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
