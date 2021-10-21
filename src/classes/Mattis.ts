import { createLogger } from '../utilities/logger';
import { EventsLoader } from './EventsLoader';
import { ActionManager } from './ActionManager';
import * as config from '../config';
import { Client, ClientOptions } from 'discord.js';
import { resolve } from 'path';

export class Mattis extends Client {
	public readonly config = config;

	public readonly logger = createLogger('bot');

	public constructor(clientOptions: ClientOptions) {
		super(clientOptions);
	}

	public readonly Actions = new ActionManager(
		this,
		resolve(__dirname, '..', 'actions')
	);

	// public readonly Commands;

	// public readonly Tasks;

	public readonly Events = new EventsLoader(
		this,
		resolve(__dirname, '..', 'events')
	);

	async build(): Promise<this> {
		const start = Date.now();
		this.Events.load();
		this.on('ready', async () => {
			this.logger.debug(`Ready took ${(Date.now() - start) / 1000}s`);
		});
		await this.login();
		return this;
	}
}
