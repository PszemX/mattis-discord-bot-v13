import { actionTextReplace } from '../../utilities/actionTextReplace';
import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class WelcomeChannelMessageAction extends BaseEventAction {
	public constructor() {
		super('welcomeChannelMessage', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		const { channelId } = EventData.guildCache.settings.actions[this.name];
		const channel = EventData.args.guild.channels.cache.get(channelId);
		const welcomeChannelMessage = actionTextReplace(
			EventData,
			EventData.guildCache.settings.actions[this.name].text
		);
		channel.send(welcomeChannelMessage);
	}
}
