import {
	ApplicationCommandOptionData,
	ApplicationCommandType,
	ClientEvents,
	Guild,
	Message,
} from 'discord.js';
import { GuildCache } from '../classes/GuildCache';
import { Mattis } from '../classes/Mattis';

export interface IBadwordData {
	badword: string;
	message: Message;
	timestamp: number;
}

export interface IMemberCache {
	messages: any[];
	voiceStates: any[];
}

export interface IChannelCache {
	messages: any[];
}

export interface ILoggerOptions {
	prod: Boolean;
}

export interface IEvent {
	readonly name: keyof ClientEvents;
	execute(...args: any): void;
}

export interface IEventData {
	readonly mattis: Mattis;
	readonly guildCache: GuildCache | any;
	readonly args: any;
	readonly timestamp: number;
}

export interface IAction {
	readonly name: string;
	readonly event: string;
	trigger(EventData: IEventData): Promise<Boolean>;
	execute(EventData: IEventData): Promise<void>;
}

export interface SlashOption {
	name?: string;
	description?: string;
	type?: ApplicationCommandType;
	options?: ApplicationCommandOptionData[];
	defaultPermission?: boolean;
}

export interface ICommand {
	readonly name: string;
	readonly event: string;
	readonly meta: {
		syntaxes: any[];
		aliases?: string[];
		cooldown?: number;
		disable?: boolean;
		readonly path?: string;
		devOnly?: boolean;
		description?: string;
		readonly category?: string;
		name?: string;
		usage?: string;
		slash?: SlashOption;
		contextChat?: string;
		contextUser?: string;
	};
	execute(EventData: IEventData, commandParameters: any): any;
}

export interface IJob {
	readonly name: string;
	readonly event: string;
	execute(mattis: Mattis, guild: Guild, GuildCache: GuildCache): any;
}

export interface ICategoryMeta {
	name: string;
}

declare module 'discord.js' {
	export interface Client {
		config: Mattis['config'];
		Logger: Mattis['Logger'];
		// request: Mattis['request'];
		// commands: Mattis['commands'];
		Events: Mattis['Events'];

		build(token: string): Promise<this>;
	}

	export interface Guild {
		client: Mattis;
		queue?: any /* ServerQueue */;
	}
}
