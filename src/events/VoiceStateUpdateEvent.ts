import { BaseEvent } from '../classes/BaseStructures/BaseEvent';

export class VoiceStateUpdateEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'voiceStateUpdate');
	}
	public async execute(): Promise<void> {}
}
