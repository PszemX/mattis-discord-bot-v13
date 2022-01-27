// TODO
import { BaseEventAction } from '../../classes/BaseAction';
import { IEventData } from '../../typings';

export class CaptchaVerificationAction extends BaseEventAction {
	public constructor() {
		super('captchaVerification', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {}
}
