import { ICommand, IEventData } from '../typings';
import { Mattis } from './Mattis';

export abstract class BaseCommand implements ICommand {
	public constructor(
		public readonly name: ICommand['name'],
		public readonly event: ICommand['event'],
		public meta?: ICommand['meta']
	) {}

	public abstract execute(EventData: IEventData, commandParameters: any): any;
}
