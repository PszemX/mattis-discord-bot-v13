import { botReady } from '../utilities/botReady';
import { guildsCache } from '../utilities/guildsCache';
import { createLogger } from './Logger';
import mongoose from 'mongoose';
import { Client } from 'discord.js';
import * as config from '../config';
import parseCommandParameters from '../utilities/parseCommandParameters';

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
			this.on(clientEvent, async (...args: any) => {
				const eventData = await this.getData(...args);
				if (!eventData) return;
				this.handleEventAction(eventData, clientEvent);
			});
		}
	}

	private async getData(...args: any) {
		args = args[0];
		const guildId = args.guildId || args.guild.id;
		const guildCache = guildId ? guildsCache[guildId] : undefined;
		if (!guildCache) return null;
		const data = {
			mattis: this.user,
			guildCache,
			args,
			timestamp: Date.now(),
		};
		return data;
	}

	private async handleEventAction(data: any, event: any) {
		if (event == 'messageCreate') this.handleCommand(data);
		const eventActions = data.guildCache?.actionsByEvent[event];
		if (!eventActions) return null;
		for (const action of eventActions) {
			const actionTriggerResult: boolean = action.trigger(data);
			if (actionTriggerResult) {
				try {
					await action.func(data);
					this.logger.debug(
						`Akcja ${action.id} na serwerze ${data.args.guildId}`
					);
				} catch (error) {
					console.log(error);
				}
			}
		}
	}

	private async handleCommand(data: any) {
		const { guildCache } = data;
		if (data.args.content.startsWith(guildCache.settings.prefix)) {
			const commandContent = data.args.content.slice(
				guildCache.settings.prefix.length
			);
			const commandContentSplitted = commandContent.split(' ');
			let branch = guildCache.commandsTree;
			let commandRawParametersSplitted = [];
			for (let i = 0; i < commandContentSplitted.length; ++i) {
				const branchName = commandContentSplitted[i];
				if (branch.b && branch.b[branchName]) {
					branch = branch.b[branchName];
				} else {
					commandRawParametersSplitted = commandContentSplitted.slice(i);
					break;
				}
			}
			const command = branch.c;
			if (command) {
				const commandParameters = await parseCommandParameters(
					data,
					command,
					commandRawParametersSplitted
				);
				await command.func(data, commandParameters);
				this.logger.debug(
					`Komenda ${command.id} na serwerze ${data.args.guildId}`
				);
			}
		}
	}

	// private loadCommands(){}
}
