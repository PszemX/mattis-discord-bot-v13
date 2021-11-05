import { readyEventAction } from '../utilities/readyEventAction';
import { guildsCache } from '../utilities/guildsCache';
import { createLogger } from './Logger';
import { Client } from 'discord.js';
import * as config from '../config';

export class Mattis extends Client {
	public readonly config = config;
	public readonly logger = createLogger('bot');
	clientEvents = ['messageCreate'];

	constructor() {
		super(config.clientOptions);
		this.build();
	}

	private async build() {
		const start = Date.now();
		this.loadEvents();
		this.on('ready', () => {
			readyEventAction();
			this.logger.debug(`Ready took ${(Date.now() - start) / 1000}s.`);
		});
		await this.login(this.config.discordToken).catch(() => this.reconnect());
		return this;
	}

	private reconnect() {
		console.error(
			'Fatal connection error with discord gateway, attepting to reconnect in 30 seconds'
		);
		this.destroy();
		setTimeout(() => new Mattis(), 30000);
	}

	private loadEvents() {
		for (const clientEvent of this.clientEvents) {
			this.logger.info(`[EventsLoader] Event '${clientEvent}' loaded.`);
			this.on(clientEvent, (...args: any) => {
				const clientGuilds = Array.from(this.guilds.cache.keys());
				for (const guild of clientGuilds) {
					if (guildsCache[guild]) {
						const guildCache = guildsCache[guild];
						console.log(guildCache.actionsByEvent.command);
					}
				}
				this.getData(...args)
					.then((data: any) => {
						if (!data) return;
						for (const action of data.guildCache.actionsByEvent[clientEvent]) {
							action
								.trigger(data)
								.then((triggerResult: boolean) => {
									if (triggerResult) {
										console.log(`Akcja ${action.id}`);
										action.func(data, triggerResult);
									}
								})
								.catch((error: any) => {
									console.error(error);
								});
						}
					})
					.catch((error) => {
						console.error(error);
					});
			});
			return null;
		}
	}

	private async getData(...args: any) {
		args = args[0];
		const guildCache = args.guildId ? guildsCache[args.guildId] : undefined;
		if (!guildCache) return null;
		const data = {
			mattis: this,
			guildCache,
			guild: args.guild,
			member: args.member,
			channel: args.channel,
			user: args.author,
			args,
			messageContent: args.content,
			timestamp: null,
		};
		return data;
	}

	private async loadCommands() {
		const clientGuilds = Array.from(this.guilds.cache.keys());
		for (const guild of clientGuilds) {
			if (guildsCache[guild]) {
				const guildCache = guildsCache[guild];
				console.log(guildCache.actionsByEvent.command);
			}
		}
	}
}
