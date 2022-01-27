import { BaseEventAction } from '../../classes/BaseEventAction';
import { IEventData } from '../../typings';

export class WelcomeRoleAction extends BaseEventAction {
	public constructor() {
		super('welcomeRole', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		await EventData.args.roles.add(
			EventData.guildCache.settings.actions[this.name].roleId
		);
	}
}
