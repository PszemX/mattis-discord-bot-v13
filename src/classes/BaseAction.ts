import { IEventData } from '../typings';
import { Mattis } from './Mattis';

export abstract class BaseEventAction {
	public constructor() {}

	public abstract trigger(EventData: IEventData): Promise<Boolean>;

	public abstract execute(EventData: IEventData): Promise<void>;
}
