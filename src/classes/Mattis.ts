import { Client } from 'discord.js';
import { resolve } from 'path';
import { ClientUtils } from '../utilities/ClientUtils';
import { ActionsManager } from './Managers/ActionsManager';
import { GuildsManager } from './Managers/GuildsManager';
import { EventsManager } from './Managers/EventsManager';
import { LogsManager } from './Managers/LogsManager';
import { HttpServer } from './HttpsServer';
import { Database } from './Database';
import * as config from '../config';

export class Mattis extends Client {
	public readonly config = config;
	public readonly Actions = new ActionsManager(this, resolve(__dirname, '..', 'actions'));
	public readonly Events = new EventsManager(this, resolve(__dirname, '..', 'events'));
	public readonly Logger = new LogsManager({ prod: this.config.isProd });
	public readonly httpServer = new HttpServer(this);
	public readonly Guilds = new GuildsManager(this);
	public readonly utils = new ClientUtils(this);
	public readonly Database = new Database();

	constructor() {
		super(config.clientOptions);
	}

	public async build() {
		const start = Date.now();
		await this.Database.makeConnection();
		await this.Actions.loadActions();
		this.Events.load();
		this.on('ready', async () => {
			await this.httpServer.run();
			await this.Guilds.loadGuildsData();
			await this.Actions.loadCommands();
			this.Logger.debug(`Ready took ${(Date.now() - start) / 1000}s.`);
		});
		await this.login();
		return this;
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
	- correct models/guildsData
*/
