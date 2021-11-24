import { botReady } from '../utilities/botReady';
import { guildsCache } from '../utilities/guildsCache';
import { createLogger } from './Logger';
import mongoose from 'mongoose';
import { Client } from 'discord.js';
import * as config from '../config';

export class Mattis extends Client {
	public readonly config = config;
	public readonly logger = createLogger('bot');
	private readonly clientEvents = [
		'channelCreate',
		'channelDelete',
		'channelPinsUpdate',
		'channelUpdate',
		'emojiCreate',
		'emojiDelete',
		'emojiUpdate',
		'guildBanAdd',
		'guildBanRemove',
		'guildCreate',
		'guildDelete',
		'guildIntegrationsUpdate',
		'guildMemberAdd',
		'guildMemberAvailable',
		'guildMemberRemove',
		'guildMembersChunk',
		'guildMemberUpdate',
		'guildUnavailable',
		'guildUpdate',
		'interactionCreate',
		'inviteCreate',
		'inviteDelete',
		'messageCreate',
		'messageDelete',
		'messageDeleteBulk',
		'messageReactionAdd',
		'messageReactionRemove',
		'messageReactionRemoveAll',
		'messageReactionRemoveEmoji',
		'messageUpdate',
		'presenceUpdate',
		'roleCreate',
		'roleDelete',
		'roleUpdate',
		'stageInstanceCreate',
		'stageInstanceDelete',
		'stageInstanceUpdate',
		'threadCreate',
		'threadDelete',
		'threadListSync',
		'threadMembersUpdate',
		'threadMemberUpdate',
		'threadUpdate',
		'typingStart',
		'userUpdate',
		'voiceStateUpdate',
		'webhookUpdate',
	];

	constructor() {
		super(config.clientOptions);
		this.build();
	}

	private async build() {
		const start = Date.now();
		//this.databaseConnect();
		this.handleEvents();
		// this.loadCommands();
		this.on('ready', () => {
			botReady();
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

	private databaseConnect() {
		mongoose.connect(config.mongoUri);

		mongoose.connection.once('open', () => {
			this.logger.info('[Database] Mongodb connected.');
		});
	}

	private async handleEvents() {
		for (const clientEvent of this.clientEvents) {
			this.logger.info(`[EventsLoader] Event '${clientEvent}' loaded.`);
			this.on(clientEvent, (...args: any) => {
				this.getData(...args)
					.then((data: any) => {
						if (!data) return;
						const eventActions = data.guildCache?.actionsByEvent[clientEvent];
						if (!eventActions) return;
						for (const action of eventActions) {
							action
								.trigger(data)
								.then(async (triggerResult: boolean) => {
									if (triggerResult) {
										await action.func(data);
										this.logger.debug(
											`Akcja ${action.id} na serwerze ${data.args.guildId}`
										);
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
		}
	}

	private async getData(...args: any) {
		args = args[0];
		const guildCache = args.guildId ? guildsCache[args.guildId] : undefined;
		if (!guildCache) return null;
		const data = {
			mattis: this.user,
			guildCache,
			args,
			timestamp: Date.now(),
		};
		return data;
	}

	// private loadCommands(){}
}
