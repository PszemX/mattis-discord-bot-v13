import { BaseEvent } from '../classes/BaseEvent';

export class MessageReactionAddEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'messageReactionAdd');
	}

	public async execute(): Promise<void> {}
}
