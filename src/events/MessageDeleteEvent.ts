import { BaseEvent } from '../classes/BaseStructures/BaseEvent';

export class MessageDeleteEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'messageDelete');
	}

	public async execute(): Promise<void> {}
}
