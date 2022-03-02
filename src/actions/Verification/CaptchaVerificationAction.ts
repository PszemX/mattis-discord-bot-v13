// TODO
import { BaseEventAction } from '../../classes/BaseEventAction';
import { IEventData } from '../../typings';

export class CaptchaVerificationAction extends BaseEventAction {
	public constructor() {
		super('captchaVerification', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		const captchaCode = this.createCode();
		await EventData.args.send(captchaCode);
	}

	private createCode(): String {
		const numbers: string = '1234567890';
		const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
		const uppercase: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const chars: string = numbers + lowercase + uppercase;
		const code: string[] = [];
		for (let i = 0; i < 6; i++) {
			code.push(chars.charAt(Math.floor(Math.random() * chars.length)));
		}
		return code.join('');
	}
}
