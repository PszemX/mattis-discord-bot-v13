import { Mattis } from './Mattis';
import { IEvent, IEventData } from '../typings';
import { promises as fs } from 'fs';
import { resolve } from 'path';

export class EventsManager {
	public constructor(public Mattis: Mattis, public path: string) {}
	public load(): void {
		fs.readdir(resolve(this.path))
			.then(async (events) => {
				this.Mattis.Logger.info(
					`[EventManager] Loading ${events.length} events...`
				);
				for (const file of events) {
					const event = await this.Mattis.utils.import<IEvent>(
						resolve(this.path, file),
						this.Mattis
					);
					if (event === undefined)
						throw new Error(`File ${file} is not a valid event file.`);
					this.Mattis.Logger.info(
						`[EventManager] Events on listener ${event.name.toString()} has been added.`
					);

					this.Mattis.on(event.name, async (...args) => {
						const eventData = await this.Mattis.utils.getEventData(...args);
						if (!eventData.guildCache) return;
						await this.handleEventAction(eventData, event);
						event.execute(...args);
					});
				}
			})
			.catch((err) => this.Mattis.Logger.error('EVENTS_LOADER_ERR:', err))
			.finally(() =>
				this.Mattis.Logger.info('[EventManager] Done loading events.')
			);
	}
	private async handleEventAction(
		eventData: IEventData,
		event: IEvent
	): Promise<void> {
		if (
			eventData.guildCache != null &&
			typeof eventData.guildCache != 'string'
		) {
			const eventActions = eventData.guildCache.actionsByEvent[event.name];
			if (!eventActions) return;
			for (const action of eventActions) {
				const actionTriggerResult: boolean = await action.trigger(eventData);
				if (actionTriggerResult) {
					try {
						await action.execute(eventData);
						this.Mattis.Logger.debug(
							`Akcja ${action.id} na serwerze ${eventData.guildCache.settings.id}`
						);
					} catch (error) {
						this.Mattis.Logger.error(error);
					}
				}
			}
		}
	}
}
