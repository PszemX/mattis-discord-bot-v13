import { GuildCache } from '../../classes/GuildCache';
import { BaseJob } from '../../classes/BaseJob';

export class SendMessageJob extends BaseJob {
	public constructor() {
		super('sendMessageJob', 'job');
	}

	public async execute(guildCache: GuildCache) {}
}
