import { BaseEvent } from '../classes/BaseStructures/BaseEvent';

export class GuildMemberAddEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'guildMemberAdd');
	}

	public async execute(): Promise<void> {}
}
