import { ClientEvents } from 'discord.js';

export interface IEvent {
	readonly name: keyof ClientEvents;
	execute(...args: any): void;
}

export interface IAction {}
