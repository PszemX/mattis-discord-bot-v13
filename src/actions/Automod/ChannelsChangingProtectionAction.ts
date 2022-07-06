import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class ChannelsChangingProtectionAction extends BaseEventAction {
	public constructor() {
		super('channelsChangingProtection', 'voiceStateUpdate');
	}

	public async trigger(EventData: IEventData) {
		const checkChannels =
			!EventData.args[1].channelId ||
			EventData.args[0].channelId == EventData.args[1].channelId;
		if (checkChannels) return false;
		const settings = EventData.guildCache.settings.actions[this.name];
		return (
			EventData.guildCache.cacheManager
				.getMemberCache(EventData.args[1].member)
				.channelsChangingProtection.filter(
					(voiceChannelJoin: any) =>
						Date.now() - voiceChannelJoin.time < settings.perMilisecondsTime
				).length > settings.maxChannels
		);
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.member.voice.disconnect();
		// Kara
	}
}
