import { BaseEventAction } from '../../classes/BaseAction';
import { IEventData } from '../../typings';

export class WelcomeRoleAction extends BaseEventAction {
	public id = 'welcomeRole';
	public event = 'guildMemberAdd';
	public tags = {};
	public isOnlyForHumans: Boolean = true;
	public constructor() {
		super();
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		EventData.args.roles.add(
			EventData.guildCache.settings.actions[this.id].roleId
		);
	}
}
