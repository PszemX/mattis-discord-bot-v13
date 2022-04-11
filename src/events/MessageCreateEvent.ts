import { Message, User } from 'discord.js';
import latinize from 'latinize';
import { BaseEvent } from '../classes/BaseStructures/BaseEvent';
import { IEventData } from '../typings';
import badwords from '../utilities/badwords.json';

export class MessageCreateEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'messageCreate');
	}

	public async execute(message: Message): Promise<Message | void> {
		// TO DO: Check if commands are not ready.
		// TO DO: Check if Mattis isn't mentioned. If so, send info embed.
		if (message.channel.type === 'DM') return;
		if (message.guild === null) return;
		if (message.author.bot) return;
		const EventData: IEventData = this.mattis.utils.getEventData(message);
		this.cacheMessage(EventData);
		const { guildCache } = EventData;
		if (message.content.startsWith(guildCache.settings.prefix)) {
			await this.mattis.Actions.handleCommand(EventData);
		}
	}

	private getUserFromMention(mention: string): User | undefined {
		const matches = /^<@!?(\d+)>$/.exec(mention);
		if (!matches) return undefined;

		const id = matches[1];
		return this.mattis.users.cache.get(id);
	}

	private cacheMessage(EventData: IEventData): void {
		this.spamCache(EventData);
		this.badwordsCache(EventData);
		this.emojiCache(EventData);
		this.capslockCache(EventData);
	}

	private spamCache(EventData: IEventData): void {
		const settings = EventData.guildCache.settings.actions.spamProtection;
		const message = EventData.args;
		const { member } = message;
		const timestamp = message.createdTimestamp;
		const hashedCacheData = `spam.${member.id}.${message.id}.${timestamp}`;
		EventData.guildCache.cacheManager.getMemberCache(member).messages.push(hashedCacheData);
	}

	private badwordsCache(EventData: IEventData): void {
		// const settings = EventData.guildCache.settings.actions[this.name];
		const message = latinize(EventData.args.content.toLowerCase());
		const { length } = message;
		const { member } = EventData.args;
		const timestamp = EventData.args.createdTimestamp;
		const messageId = EventData.args.id;
		let editedMessage = '';
		let singleLetter = message[0];
		for (let i = 1; i <= length; i++) {
			if (singleLetter != message[i] && singleLetter != ' ') {
				editedMessage += singleLetter;
			}
			singleLetter = message[i];
		}
		const badwordsInMessage: string[] = [];
		for (const badword of badwords) {
			const editedMessageLength = editedMessage.match(new RegExp(badword, 'gi'))?.length || 0;
			for (let i = 0; i < editedMessageLength; i++) {
				if (editedMessage.includes(badword)) {
					badwordsInMessage.push(badword);
					editedMessage = editedMessage.replace(new RegExp(badword, 'i'), '');
				}
			}
		}
		if (badwordsInMessage.length) {
			// eslint-disable-next-line guard-for-in
			for (const badword in badwordsInMessage) {
				const hashedCacheData = `badwords.${badword}.${member.id}.${messageId}${timestamp}`;
				EventData.guildCache.cacheManager.getMemberCache(member).messages.push(hashedCacheData);
			}
		}
	}

	private emojiCache(EventData: IEventData): void {
		const messageId = EventData.args;
		const { member } = EventData.args;
		const timestamp = EventData.args.createdTimestamp;
		const settings = EventData.guildCache.settings.actions[this.name];
		const outsideEmojiRegex = /(<a?)?:.+?:(\d{18}>)?/gi;
		const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
		const message = EventData.args.toString().replace(outsideEmojiRegex, '️♥').replace(emojiRegex, '♥').replace(/️+/g, '');
		if (message.length <= settings.minMessageLength) return;
		const messageWithoutEmojis = message.replace(/♥/g, '');
		const emojisAmout = message.length - messageWithoutEmojis.length;
		if ((emojisAmout / message.length) * 100 > settings.maxPercentage) {
			const hashedCacheData = `emojis.${member.id}.${messageId}${timestamp}`;
			EventData.guildCache.cacheManager.getMemberCache(member).messages.push(hashedCacheData);
		}
	}

	private capslockCache(EventData: IEventData): void {
		const messageId = EventData.args;
		const { member } = EventData.args;
		const timestamp = EventData.args.createdTimestamp;
		const settings = EventData.guildCache.settings.actions[this.name];
		const message = EventData.args.content;
		if (message.length <= settings.minMessageLength) return;
		const caps = message.toUpperCase();
		const nocaps = message.toLowerCase();
		let sum = 0;
		let length = 0;

		for (let i = 0; i < message.length; ++i) {
			if (caps[i] != nocaps[i]) {
				if (caps[i] === message[i]) ++sum;
				++length;
			}
		}
		if ((sum / length) * 100 > settings.maxPercentage) {
			const hashedCacheData = `capslock.${member.id}.${messageId}${timestamp}`;
			EventData.guildCache.cacheManager.getMemberCache(member).messages.push(hashedCacheData);
		}
	}
}
