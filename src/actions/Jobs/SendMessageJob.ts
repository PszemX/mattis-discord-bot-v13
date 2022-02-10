import { GuildCache } from '../../classes/GuildCache';
import { BaseJob } from '../../classes/BaseJob';

export class SendMessageJob extends BaseJob {
	public constructor() {
		super('sendMessage', 'job');
	}

	public async execute(GuildCache: GuildCache) {}
}
