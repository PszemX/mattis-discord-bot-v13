import { BaseEvent } from '../classes/BaseEvent';

export class MessageCreateEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'messageCreate');
	}

	public async execute(): Promise<void> {}
}
