import { botReady } from '../utilities/EventsUtilities/botReady';
import { updateGuildsData } from '../utilities/updateGuildsData';
import { createLogger } from './Logger';
import { Client, Collection } from 'discord.js';
import { Database } from '../structures/Database';
import * as config from '../config';
import parseCommandParameters from '../utilities/parseCommandParameters';
import { guildAddToDatabase } from '../utilities/EventsUtilities/guildAddToDatabase';
import { isThisYear } from 'date-fns/esm';

export class Mattis extends Client {
	public Database = new Database();
	private GuildsData = new Collection();
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
		await this.databaseConnect();
		await this.initialGuildsData();
		this.handleEvents();
		// this.loadCommands();
		this.on('ready', () => {
			botReady();
			this.logger.debug(`Ready took ${(Date.now() - start) / 1000}s.`);
		});
		await this.login(config.discordToken).catch(() => this.reconnect());
		return this;
	}

	private reconnect() {
		console.error(
			'Fatal connection error with discord gateway, attepting to reconnect in 30 seconds'
		);
		this.destroy();
		setTimeout(() => new Mattis(), 30000);
	}

	private async handleEvents() {
		this.on('raw', async (event) => {
			this.handleRawEvent(event);
		});
		this.on('guildCreate', async (guild) => {
			await guildAddToDatabase(guild, this)
				.then(() => this.logger.info('Nowy serwer dodany do bazy danych!'))
				.catch((error) => this.logger.error(error));
		});
		for (const clientEvent of this.clientEvents) {
			this.logger.info(`[EventsLoader] Event '${clientEvent}' loaded.`);
			this.on(clientEvent, async (...args: any) => {
				const eventData = await this.getData(...args);
				if (!eventData) return;
				this.handleEventAction(eventData, clientEvent);
			});
		}
	}

	private async handleRawEvent(event: any) {
		// https://gist.github.com/Danktuary/27b3cef7ef6c42e2d3f5aff4779db8ba
		const events: any = {
			MESSAGE_REACTION_ADD: 'messageReactionAdd',
			MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
		};

		// `event.t` is the raw event name
		if (!events.hasOwnProperty(event.t)) return;
		const { d: data } = event;
		const user = await this.users.fetch(data.user_id);
		const channel: any =
			this.channels.cache.get(data.channel_id) || (await user?.createDM());

		// if the message is already in the cache, don't re-emit the event
		if (channel?.messages.cache.has(data.message_id)) return;
		// if you're on the master/v12 branch, use `channel.messages.fetch()`
		const message = await channel.messages.fetch(data.message_id);

		// custom emojis reactions are keyed in a `name:ID` format, while unicode emojis are keyed by names
		// if you're on the master/v12 branch, custom emojis reactions are keyed by their ID
		const emojiKey = data.emoji.id
			? `${data.emoji.name}:${data.emoji.id}`
			: data.emoji.name;
		const reaction = message.reactions.cache.get(emojiKey);
		this.emit(events[event.t], reaction, user);
	}

	private async getData(...args: any) {
		for (const arg of args) {
			if (arg?.guildId || arg?.guild?.id || arg?.message?.guildId) {
				var guildId = arg?.guildId || arg?.guild?.id || arg?.message?.guildId;
				break;
			}
		}
		const guildCache = guildId ? this.GuildsData.get(guildId) : undefined;
		if (!guildCache) return null;
		const data = {
			mattis: this,
			guildCache,
			args: args.length > 1 ? args : args[0],
			timestamp: Date.now(),
		};
		return data;
	}

	private async handleEventAction(data: any, event: any) {
		if (event == 'messageCreate') this.handleCommand(data);
		const eventActions = data.guildCache?.actionsByEvent[event];
		if (!eventActions) return null;
		for (const action of eventActions) {
			const actionTriggerResult: boolean = await action.trigger(data);
			if (actionTriggerResult) {
				try {
					await action.func(data);
					this.logger.debug(
						`Akcja ${action.id} na serwerze ${data.guildCache.settings.id}`
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

	private async databaseConnect() {
		await this.Database.connect()
			.then(() => {
				this.Database.log.info(
					'[Database] Succesfully connected to the Database!'
				);
			})
			.catch((error) => this.Database.log.error(error));
	}

	private async initialGuildsData() {
		// Wpisanie do bazy danych serwerów, których nie ma, a na których znajduje się Mattis.
		// const mattisGuildsList = this.guilds.cache;

		// Stworzenie guildsData dla każdego serwera w bazie danych.
		const databaseGuildIds = (
			await this.Database.db('guildsData').listCollections().toArray()
		).map((u) => u.name);
		for (const guildId of databaseGuildIds) {
			const guildSettings = await this.Database.guildsData('settings').findOne({
				id: guildId,
			});
			if (guildId != 'settings') {
				this.GuildsData.set(guildId, await updateGuildsData(guildSettings));
			}
		}
	}

	// private loadCommands(){}
}
