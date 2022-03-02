import { Message, User } from 'discord.js';
import { BaseEvent } from '../classes/BaseEvent';
import { IEventData } from '../typings';

export class MessageCreateEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'messageCreate');
	}

	public async execute(message: Message): Promise<Message | void> {
		// TO DO: Check if message was sent on DM, author is the bot or commands are not ready.
		// TO DO: Check if Mattis isn't mentioned. If so, send info embed.
		if (message.channel.type === 'DM') return;
		if (message.guild === null) return;
		if (message.author.bot) return;
		const EventData: IEventData = this.mattis.utils.getEventData(message);
		const { guildCache } = EventData;
		if (message.content.startsWith(guildCache.settings.prefix)) {
			this.mattis.Actions.handleCommand(EventData);
		}
	}

	private getUserFromMention(mention: string): User | undefined {
		const matches = /^<@!?(\d+)>$/.exec(mention);
		if (!matches) return undefined;

		const id = matches[1];
		return this.mattis.users.cache.get(id);
	}
}
