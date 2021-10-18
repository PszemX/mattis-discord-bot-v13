import { createLogger } from '../utilities/logger';
import { EventsLoader } from './EventsLoader';
import * as config from '../config';
import { Client, ClientOptions } from 'discord.js';
import { resolve } from 'path';

export class Mattis extends Client {
	public readonly config = config;

	public readonly logger = createLogger('bot');

	public constructor(clientOptions: ClientOptions) {
		super(clientOptions);
	}

	public readonly events = new EventsLoader(
		this,
		resolve(__dirname, '..', 'events')
	);

	async build(): Promise<this> {
		const start = Date.now();
		this.events.load();
		this.on('ready', async () => {
			console.log(`Ready took ${(Date.now() - start) / 1000}s`);
		});
		await this.login();
		return this;
	}
}
