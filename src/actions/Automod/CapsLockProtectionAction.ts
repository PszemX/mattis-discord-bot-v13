import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class CapsLockProtectionAction extends BaseEventAction {
	public constructor() {
		super('capsLockProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message = EventData.args.content;
		if (message.length <= settings.minMessageLength) return false;
		const caps = message.toUpperCase();
		const nocaps = message.toLowerCase();
		let sum = 0;
		let length = 0;

		for (let i = 0; i < message.length; ++i) {
			if (caps[i] != nocaps[i]) {
				if (caps[i] === message[i]) ++sum;
				++length;
			}
		}
		return (sum / length) * 100 > settings.maxPercentage;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
