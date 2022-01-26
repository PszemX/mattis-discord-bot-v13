import { BaseEventAction } from '../../classes/BaseAction';
import { IEventData } from '../../typings';

export class WelcomeRoleAction extends BaseEventAction {
	public constructor() {
		super('welcomeRole', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		// EventData.args.roles.add(
		// 	EventData.guildCache.settings.actions[this.id].roleId
		// );
		EventData.args.send('Siema');
	}
}
