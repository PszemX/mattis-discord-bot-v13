import { createLogger } from '../utilities/logger';
import * as config from '../config';
import { Client, ClientOptions, Collection } from 'discord.js';
import { promises as fs } from 'fs';
import { resolve, parse } from 'path';
import { IEvent } from '../typings';

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
		this.loadEvents(resolve(__dirname, '..', 'events'));
		this.on('ready', async () => {
			this.logger.debug(`Ready took ${(Date.now() - start) / 1000}s`);
		});
		await this.login();
		return this;
	}

	private loadEvents(path: string): void {
		fs.readdir(resolve(path)).then(async (eventFiles) => {
			for (const eventFile of eventFiles) {
				const event = await this.import<IEvent>(resolve(path, eventFile), this);
				if (event === undefined)
					throw new Error(`File ${eventFile} is not a valid event file.`);
				this.on(event.name, (...args) => event.execute(...args));
			}
		});
	}

	public async import<T>(path: string, ...args: any[]): Promise<T | undefined> {
		const file = await import(resolve(path)).then((m) => m[parse(path).name]);
		return file ? new file(...args) : undefined;
	}
}
