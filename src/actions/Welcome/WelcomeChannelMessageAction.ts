import { BaseEventAction } from '../../classes/BaseAction';
import { IEventData } from '../../typings';

export class WelcomeChannelMessageAction extends BaseEventAction {
	public constructor() {
		super('welcomeChannelMessage', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		const channelId =
			EventData.guildCache.settings.actions[this.name].channelId;
		const channel = EventData.args.guild.channels.cache.get(channelId);
		const welcomeChannelMessage =
			EventData.guildCache.settings.actions[this.name].text;
		channel.send(welcomeChannelMessage);
	}
}
