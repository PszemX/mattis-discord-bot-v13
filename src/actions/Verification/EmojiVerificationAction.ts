// TODO
import { BaseEventAction } from '../../classes/BaseAction';
import { IEventData } from '../../typings';

export class EmojiVerificationAction extends BaseEventAction {
	public constructor() {
		super('emojiVerification', 'messageReactionAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {}
}
