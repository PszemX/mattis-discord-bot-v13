import { promises as fs } from 'fs';
import { resolve, parse } from 'path';
import { Mattis } from './Mattis';

export class EventsLoader {
	public constructor(public client: Mattis, public path: string) {}

	public load(): void {
		fs.readdir(resolve(this.path))
			.then(async (events) => {
				this.client.logger.info(`Loading ${events.length} events...`);
				for (const file of events) {
					const event = await this.import<any>(
						resolve(this.path, file),
						this.client
					);
					if (event === undefined)
						throw new Error(`File ${file} is not a valid event file.`);
					this.client.logger.info(`Event '${event.name.toString()}' loaded.`);
					this.client.on(event.name, (...args) => event.execute(...args));
				}
			})
			.catch((err) => this.client.logger.error('EVENTS_LOADER_ERR:', err))
			.finally(() => this.client.logger.info('Done loading events.'));
	}

	private async import<T>(
		path: string,
		...args: any[]
	): Promise<T | undefined> {
		const file = await import(resolve(path)).then((m) => m[parse(path).name]);
		return file ? new file(...args) : undefined;
	}
}
