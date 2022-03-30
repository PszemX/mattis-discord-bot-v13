import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class EmojiProtectionAction extends BaseEventAction {
	public constructor() {
		super('emojiProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const outsideEmojiRegex = /(<a?)?:.+?:(\d{18}>)?/gi;
		const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
		const message = EventData.args.toString().replace(outsideEmojiRegex, '️♥').replace(emojiRegex, '♥').replace(/️+/g, '');
		if (message.length <= settings.minMessageLength) return false;
		const messageWithoutEmojis = message.replace(/♥/g, '');
		const emojisAmout = message.length - messageWithoutEmojis.length;
		return (emojisAmout / message.length) * 100 > settings.maxPercentage;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
