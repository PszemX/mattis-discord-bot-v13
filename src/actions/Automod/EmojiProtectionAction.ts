import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class EmojiProtectionAction extends BaseEventAction {
	public constructor() {
		super('emojiProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message = EventData.args.content.replace(/<a?:[a-z0-9_]+:\d+>|:[a-z0-9_]+:/gi, '😀').replace(/ /g, '');
		if (message.length <= settings.minMessageLength) return false;
		const emojiRegex =
			/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/gi;
		const newmsg = message.replace(emojiRegex, '');

		return (newmsg.length / message.length) * 100 < settings.maxPercentage;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
