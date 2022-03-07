import { ICommand, IEventData } from '../../typings';

export abstract class BaseCommand implements ICommand {
	public constructor(
		public readonly name: ICommand['name'],
		public readonly event: ICommand['event'],
		public readonly meta: ICommand['meta']
	) {}

	public abstract execute(EventData: IEventData, commandParameters: any): any;
}
