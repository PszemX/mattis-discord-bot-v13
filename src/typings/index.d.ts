import { GuildCache } from '../classes/GuildCache';
import { Mattis } from '../classes/Mattis';
import { ClientEvents } from 'discord.js';

export interface ILoggerOptions {
	prod: Boolean;
}

export interface IEvent {
	readonly name: keyof ClientEvents;
	execute(...args: any): void;
}
export interface IAction {
	readonly name: string;
	readonly event: string;
	trigger(EventData: IEventData): Promise<Boolean>;
	execute(EventData: IEventData): Promise<void>;
}

export interface IEventData {
	readonly mattis: Mattis;
	readonly guildCache: GuildCache | any;
	readonly args: any;
	readonly timestamp: number;
}

export interface ICategoryMeta {
	name: string;
}

declare module 'discord.js' {
	// @ts-expect-error Override typings
	export interface Client extends OClient {
		config: Mattis['config'];
		Logger: Mattis['Logger'];
		// request: Mattis['request'];
		//commands: Mattis['commands'];
		Events: Mattis['Events'];

		build(token: string): Promise<this>;
	}

	export interface Guild {
		client: Mattis;
		queue?: any /*ServerQueue*/;
	}
}
