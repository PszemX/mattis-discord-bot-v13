import { createLogger } from '../utilities/logger';
import * as config from '../config';
import { Client, ClientOptions, Collection } from 'discord.js';
import { resolve } from 'path';

export class Mattis extends Client {
	public readonly config = config;
	public readonly logger = createLogger('bot');

	commands: any;
	eventActions: any;
	tasks: any;

	public constructor(clientOptions: ClientOptions) {
		super(clientOptions);
		this.commands = 0;
		this.eventActions = 0;
		this.tasks = 0;
	}

	async build(): Promise<this> {
		const start = Date.now();
		this.on('ready', async () => {
			this.logger.debug(`Ready took ${(Date.now() - start) / 1000}s`);
		});
		await this.login();
		return this;
	}
}
