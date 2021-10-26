import { Client, Collection } from 'discord.js';
import * as config from '../config';
import fs from 'fs';
import { clientOptions } from '../config';
import loadGuildsCache from '../utilities/loadGuildsCache';
import { createLogger } from '../utilities/Logger';
import { resolve } from 'path';

export class Mattis extends Client {
	config = config;
	guildsCache: any;
	logger = createLogger('bot');

	constructor() {
		super(clientOptions);
		this.guildsCache = loadGuildsCache();
		this.loadEvents();
		this.build();
	}

	private build() {
		super.login(this.config.discordToken).catch(() => this.reconnect());
	}

	private reconnect() {
		console.error(
			'Fatal connection error with discord gateway, attepting to reconnect in 30 seconds'
		);
		this.destroy();
		setTimeout(() => new Mattis(), 30000);
	}

	private loadEvents() {
		fs.readdir('./dist/events', (err: any, files: any) => {
			if (err) return console.error(err);
			for (const file of files) {
				const event = require(`../events/${file}`);
				const [eventName]: any = file.split('.');
				this.logger.info(`[EventsLoader] Event ${eventName} loaded.`);
				this.on(eventName, (...args: any) => {
					if (eventName === 'ready') event.default();
					this.getData(...args).then((data: any) => {
						if (!data) return;
					});
				});
			}
			return null;
		});
	}

	private async getData(...args: any) {
		args = args[0];
		const guildCache = args.guildId
			? this.guildsCache[args.guildId]
			: undefined;
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
}
