import { Message } from 'discord.js';
import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

/* If a user sends more than `maxMessages` in `perMilisecondsTime` milliseconds, delete the message and send a warning */
export class SpamProtectionAction extends BaseEventAction {
	public constructor() {
		super('spamProtection', 'messageCreate');
	}

	/**
	 * If the member has sent more than the maxMessages in the last perMilisecondsTime, return true
	 * @param {IEventData} EventData - The event data object.
	 * @returns A boolean value.
	 */
	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message: Message = EventData.args;
		const { member } = message;
		const cachedMessages = EventData.guildCache.cacheManager.getMemberCache(
			member
		).messages;
		return cachedMessages.length > settings.maxMessages;
	}

	/**
	 * This function is called when the command is executed
	 * @param {IEventData} EventData - The event data object.
	 */
	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
