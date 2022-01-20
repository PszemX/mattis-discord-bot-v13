import { ClientEvents } from 'discord.js';
import { Mattis } from '../classes/Mattis';

export interface ILoggerOptions {
	prod: Boolean;
}

export interface IEvent {
	readonly name: keyof ClientEvents;
	execute(...args: any): void;
}

export interface IEventData {
	readonly mattis: Mattis;
	readonly guildCache: IGuildCache | undefined | string;
	readonly args: any;
	readonly timestamp: number;
}

export interface IGuildCache {
	readonly settings: any;
	readonly actionsByEvent: any;
	readonly commandsTree: any;
}

export interface IAction {}

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
