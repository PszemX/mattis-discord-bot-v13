import { GuildCache } from './GuildCache';
import { IJob } from '../typings';

export abstract class BaseJob implements IJob {
	public constructor(
		public readonly name: IJob['name'],
		public readonly event: IJob['event'] // public readonly meta: ICommand['meta']
	) {}

	public abstract execute(guildCache: GuildCache): Promise<void>;
}
