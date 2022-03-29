import { GuildMember, Message } from 'discord.js';
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
		const message = EventData.args;
		const { member } = message;
		EventData.guildCache.cacheManager.getMemberCache(member).spamProtection.push(message);
		return (
			EventData.guildCache.cacheManager.getMemberCache(member).spamProtection.filter(
				(cachedMessage: Message) => Date.now() - cachedMessage.createdTimestamp < settings.perMilisecondsTime,
			).length > settings.maxMessages
		);
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
