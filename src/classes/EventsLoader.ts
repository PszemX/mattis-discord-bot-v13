import { resolve } from 'path';
import { Mattis } from './Mattis';
import { promises as fs } from 'fs';

export default class EventsLoader {
	constructor(private readonly bot: Mattis, private readonly path: string) {}

	load(): void {
		fs.readdir(resolve(this.path)).then(async (eventFiles) => {
			for (const eventFile of eventFiles) {
				const event = (await import(resolve(this.path, eventFile))).default;
				if (event === undefined)
					throw new Error(`File ${eventFile} is not a valid event file.`);
				event.client = this.bot;
				const [eventName] = eventFile.split('.');
				this.bot.on(eventName, (...args) => event.execute(...args));
			}
		});
	}
}
