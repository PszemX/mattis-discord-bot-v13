import { IEvent } from '../typings';
import { Mattis } from './Mattis';

export abstract class BaseEvent implements IEvent {
	public constructor(
		public client: Mattis,
		public readonly name: IEvent['name']
	) {}

	public abstract execute(...args: any): any;
}