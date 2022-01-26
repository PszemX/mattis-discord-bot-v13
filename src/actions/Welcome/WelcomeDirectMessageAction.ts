import { BaseEventAction } from '../../classes/BaseAction';
import { IEventData } from '../../typings';

export class WelcomeDirectMessageAction extends BaseEventAction {
	public constructor() {
		super('welcomeDirectMessage', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		const welcomeDirectMessage =
			EventData.guildCache.settings.actions[this.name].text;
		EventData.args.send(welcomeDirectMessage);
	}
}
