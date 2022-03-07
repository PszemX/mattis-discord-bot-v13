import { Client, ClientOptions } from 'discord.js';
import express from 'express';
import { resolve } from 'path';
import { ClientUtils } from '../utilities/ClientUtils';
import { ActionsManager } from './Managers/ActionsManager';
import { GuildsManager } from './Managers/GuildsManager';
import { EventsManager } from './Managers/EventsManager';
import { LogsManager } from './Managers/LogsManager';
import { Database } from './Database';
import * as config from '../config';

const app = express();

export class Mattis extends Client {
	public readonly config = config;
	public readonly Actions = new ActionsManager(this, resolve(__dirname, '..', 'actions'));
	public readonly Events = new EventsManager(this, resolve(__dirname, '..', 'events'));
	public readonly Logger = new LogsManager({ prod: this.config.isProd });
	public readonly Guilds = new GuildsManager(this);
	public readonly utils = new ClientUtils(this);
	public readonly Database = new Database();

	constructor() {
		super(<ClientOptions>config.clientOptions);
	}

	public async build() {
		const start = Date.now();
		await this.Database.makeConnection();
		await this.Actions.loadActions();
		this.Events.load();
		this.on('ready', async () => {
			await this.httpServer();
			await this.Guilds.loadGuildsData();
			await this.Actions.loadCommands();
			this.Logger.debug(`Ready took ${(Date.now() - start) / 1000}s.`);
		});
		await this.login().catch(() => this.reconnect());
		return this;
	}

	private reconnect() {
		this.Logger.error(
			'Fatal connection error with discord gateway, attepting to reconnect in 30 seconds',
		);
		this.destroy();
		setTimeout(() => new Mattis().build(), 30000);
	}

	private async httpServer() {
		app.get('/', (req: any, res: any) => {
			res.send('Mattis on!');
		});

		app.listen(process.env.PORT || 80);
	}
}

/* TO DO:
	- fetchGuild util
	- fetchUser util
	- add tags to actions and commands and its usage
	- change Guilds to used by shard
	- slashCommands
	- make more typings
	- make cacheManager
	- correct all ESLint errors
	- automod
	- moderating commands 
	- more logs 
	- overall codereview
	- english lang version 
	- default values and more possibilites to set action settings for guild
	- add jsDoc
*/