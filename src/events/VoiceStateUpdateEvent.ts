import { GuildMember, VoiceState } from 'discord.js';
import { BaseEvent } from '../classes/BaseStructures/BaseEvent';
import { IEventData } from '../typings';

export class VoiceStateUpdateEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'voiceStateUpdate');
	}
	public async execute(
		oldState: VoiceState,
		newState: VoiceState
	): Promise<void> {
		const EventData: IEventData = this.mattis.utils.getEventData(
			oldState,
			newState
		);
		const member: GuildMember | null = newState.member;
		if (!member) return;
		const timestamp = Date.now();
		const hashedCacheData = `${oldState.channelId}.${newState.channelId}.${timestamp}`;
		EventData.guildCache.cacheManager
			.getMemberCache(member)
			.voiceStates.push(hashedCacheData);
	}
}
