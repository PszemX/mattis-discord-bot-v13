import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class EmojiProtectionAction extends BaseEventAction {
	public constructor() {
		super('emojiProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message = EventData.args.content.replace(/(<a?)?:.+?:(\d{18}>)?/gi, '️♥').replace(/️+/g, '');
		if (message.length <= settings.minMessageLength) return false;
		const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
		const newmsg = message.replace(emojiRegex, '');
		return (newmsg.length / message.length) * 100 < settings.maxPercentage;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
