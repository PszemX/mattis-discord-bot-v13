import { createLogger } from '../utilities/Logger';
import * as config from '../config';
import { Client, ClientOptions, Collection } from 'discord.js';
import { resolve } from 'path';
import EventsLoader from './EventsLoader';

// TO DO: Załadować akcje, komendy itd do mattisa i zrobić reakcję na eventy
// Tak, jak to było w Mattis v12

export class Mattis extends Client {
	public readonly config = config;
	public readonly logger = createLogger('bot');
	// public readonly database: object = new Database();

	// public readonly Actions: Collection<string, object> = loadFiles(
	// 	resolve(__dirname, '..', 'actions')
	// );
	// public readonly commands: Collection<string, object> = loadFiles(
	// 	resolve(__dirname, '..', 'commands')
	// );
	// public readonly tasks: Collection<string, object> = loadFiles(
	// 	resolve(__dirname, '..', 'tasks')
	// );

	public readonly events = new EventsLoader(
		this,
		resolve(__dirname, '..', 'events')
	);

	public constructor(clientOptions: ClientOptions) {
		super(clientOptions);
	}

	async build(): Promise<this> {
		const start = Date.now();
		this.events.load();
		this.on('ready', async () => {
			this.logger.debug(`Ready took ${(Date.now() - start) / 1000}s`);
		});
		await this.login();
		return this;
	}
}
