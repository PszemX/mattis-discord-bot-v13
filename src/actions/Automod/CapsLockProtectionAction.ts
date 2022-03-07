import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class CapsLockProtectionAction extends BaseEventAction {
	public constructor() {
		super('capsLockProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		let settings = EventData.guildCache.settings.actions[this.name];
		let message = EventData.args.content;
		if (message.length <= settings.minMessageLength) return false;
		let caps = message.toUpperCase();
		let nocaps = message.toLowerCase();
		let sum = 0;
		let length = 0;

		for (let i = 0; i < message.length; ++i) {
			if (caps[i] != nocaps[i]) {
				if (caps[i] === message[i]) ++sum;
				++length;
			}
		}
		if ((sum / length) * 100 > settings.maxPercentage) return true;

		return false;
	}

	public async execute(EventData: IEventData) {
		let settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
