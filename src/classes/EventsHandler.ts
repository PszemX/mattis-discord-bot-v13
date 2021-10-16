import fs from 'fs';
import { Mattis } from './Mattis';

export class EventsHandler {
	public constructor(public client: Mattis) {}

	public load(): void {
		fs.readdir('./dist/events', async (err, events) => {
			this.client.logger.info(
				`[EventHandler] Loading ${events.length} events...`
			);
			for (const file of events) {
				const event = await import(`../events/${file}`);
				if (event === undefined) {
					throw new Error(`File ${file} is not a valid event file.`);
				}
				if (err) {
					throw new Error(`Error while compiling events: ${err}`);
				}
				this.client.logger.info(`[EventHandler] Event '${event.name}' loaded.`);
				this.client.on(event.name, (...args) => event.execute(...args));
			}
		});
	}
}
