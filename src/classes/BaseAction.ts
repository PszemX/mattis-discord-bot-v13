import { IAction, IEventData } from '../typings';

export abstract class BaseEventAction implements IAction {
	public constructor(
		public readonly name: IAction['name'],
		public readonly event: IAction['event']
	) {}

	public abstract trigger(EventData: IEventData): Promise<Boolean>;

	public abstract execute(EventData: IEventData): Promise<void>;
}
