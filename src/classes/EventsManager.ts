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
					// Handling raw events
					this.Mattis.on('raw', async (event) => {
						this.handleRawEvent(event);
					});
					// Handling cached events
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
							`Akcja ${action.name} na serwerze ${eventData.guildCache.settings.id}`
						);
					} catch (error) {
						this.Mattis.Logger.error(error);
					}
				}
			}
		}
	}

	private async handleRawEvent(event: any) {
		// https://gist.github.com/Danktuary/27b3cef7ef6c42e2d3f5aff4779db8ba
		const events: any = {
			MESSAGE_REACTION_ADD: 'messageReactionAdd',
			MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
		};

		// `event.t` is the raw event name
		if (!events.hasOwnProperty(event.t)) return;
		const { d: data } = event;
		const user = await this.Mattis.users.fetch(data.user_id);
		const channel: any =
			this.Mattis.channels.cache.get(data.channel_id) ||
			(await user?.createDM());

		// if the message is already in the cache, don't re-emit the event
		if (channel?.messages.cache.has(data.message_id)) return;
		// if you're on the master/v12 branch, use `channel.messages.fetch()`
		const message = await channel.messages.fetch(data.message_id);

		// custom emojis reactions are keyed in a `name:ID` format, while unicode emojis are keyed by names
		// if you're on the master/v12 branch, custom emojis reactions are keyed by their ID
		const emojiKey = data.emoji.id
			? `${data.emoji.name}:${data.emoji.id}`
			: data.emoji.name;
		const reaction = message.reactions.cache.get(emojiKey);
		this.Mattis.emit(events[event.t], reaction, user);
	}
}
