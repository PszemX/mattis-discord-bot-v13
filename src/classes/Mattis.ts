import { ClientUtils } from '../utilities/ClientUtils';
import { GuildsManager } from './GuildsManager';
import { EventsManager } from './EventsManager';
import { LogsManager } from './LogsManager';
import { Database } from './Database';
import * as config from '../config';
import { resolve } from 'path';
import { Client, ClientOptions } from 'discord.js';

export class Mattis extends Client {
	public readonly config = config;
	public readonly Logger = new LogsManager({ prod: this.config.isProd });
	public readonly Guilds = new GuildsManager(this);
	public readonly Events = new EventsManager(this,resolve(__dirname, '..', 'events'));
	public readonly Database = new Database();
	public readonly utils = new ClientUtils(this);

	constructor(options: ClientOptions) {
		super(options);
	}

	public async build() {
		const start = Date.now();
		await this.Database.makeConnection();
		await this.Guilds.loadGuildsData();
		this.Events.load();
		this.on('ready', () => {
			// await this.commands.load();
			this.Logger.debug(`Ready took ${(Date.now() - start) / 1000}s.`);
		});
		await this.login();
		return this;
	}
}
