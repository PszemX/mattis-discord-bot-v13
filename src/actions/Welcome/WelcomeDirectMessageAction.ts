import { actionTextReplace } from '../../utilities/actionTextReplace';
import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class WelcomeDirectMessageAction extends BaseEventAction {
	public constructor() {
		super('welcomeDirectMessage', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		const welcomeDirectMessage = actionTextReplace(
			EventData,
			EventData.guildCache.settings.actions[this.name].text
		);
		EventData.args.send(welcomeDirectMessage);
	}
}
