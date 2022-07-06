import { Message, User } from 'discord.js';
import latinize from 'latinize';
import uri from 'urijs';
import md5 from 'md5';
import { BaseEvent } from '../classes/BaseStructures/BaseEvent';
import badwords from '../utilities/badwords.json';
import { IEventData, ICachedMessageData } from '../typings';

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
		if (!message.member) return;
		const EventData: IEventData = this.mattis.utils.getEventData(message);
		await this.cacheMessage(EventData);
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

	private async cacheMessage(EventData: IEventData): Promise<void> {
		const message: Message = EventData.args;
		const cachedMessageData: ICachedMessageData = {
			id: message.id,
			messageLength: message.cleanContent.length,
			content: md5(message.cleanContent),
			badwords: await this.badwordsCache(EventData),
			capslock: await this.capslockCache(EventData),
			emojis: await this.emojiCache(EventData),
			links: await this.linksCache(EventData),
			mentions: [],
			zalgos: [],
			spoilers: [],
			timestamp: message.createdTimestamp,
		};
		console.log(cachedMessageData);
		EventData.guildCache.cacheManager
			.getMemberCache(message.member)
			.messages.push(cachedMessageData);

		EventData.guildCache.cacheManager
			.getChannelCache(message.channel)
			.messages.push(
				`${md5(message.cleanContent)}.${message.createdTimestamp}`
			);
	}

	private async badwordsCache(EventData: IEventData): Promise<string[]> {
		const badwordsInMessage: string[] = [];
		const settings = EventData.guildCache.settings.actions.badwordsProtection;
		if (settings.enabled) {
			const message = latinize(EventData.args.content.toLowerCase());
			const { length } = message;
			let editedMessage = '';
			let singleLetter = message[0];
			for (let i = 1; i <= length; i++) {
				if (singleLetter != message[i] && singleLetter != ' ') {
					editedMessage += singleLetter;
				}
				singleLetter = message[i];
			}
			for (const badword of badwords) {
				const editedMessageLength =
					editedMessage.match(new RegExp(badword, 'gi'))?.length || 0;
				for (let i = 0; i < editedMessageLength; i++) {
					if (editedMessage.includes(badword)) {
						badwordsInMessage.push(badword);
						editedMessage = editedMessage.replace(new RegExp(badword, 'i'), '');
					}
				}
			}
		}
		return badwordsInMessage;
	}

	private async capslockCache(EventData: IEventData): Promise<number> {
		let capslockAmount = 0;
		const settings = EventData.guildCache.settings.actions.capsLockProtection;
		if (settings.enabled) {
			const message = EventData.args.content;
			if (message.length <= settings.minMessageLength) return capslockAmount;
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
			capslockAmount = (sum / length) * 100;
		}
		return capslockAmount;
	}

	private async emojiCache(EventData: IEventData): Promise<number> {
		const settings = EventData.guildCache.settings.actions.emojiProtection;
		let emojiAmount = 0;
		if (settings.enabled) {
			const outsideEmojiRegex = /(<a?)?:.+?:(\d{18}>)?/gi;
			const emojiRegex =
				/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
			const message = EventData.args
				.toString()
				.replace(outsideEmojiRegex, '️♥')
				.replace(emojiRegex, '♥')
				.replace(/️+/g, '');
			if (message.length <= settings.minMessageLength) return emojiAmount;
			const messageWithoutEmojis = message.replace(/♥/g, '');
			const emojisAmout = message.length - messageWithoutEmojis.length;
			emojiAmount = (emojisAmout / message.length) * 100;
		}
		return emojiAmount;
	}

	private async linksCache(EventData: IEventData): Promise<string[]> {
		const links: string[] = [];
		const settings = EventData.guildCache.settings.actions.linksProtection;
		if (settings.enabled) {
			// @ts-ignore
			uri.withinString(EventData.args.content, (u) => links.push(u) && u);
		}
		return links;
	}

	private async mentionsCache(EventData: IEventData): Promise<string[]> {
		const mentions: string[] = [];
		const settings = EventData.guildCache.settings.actions.emojiProtection;
		if (settings.enabled) {
		}
		return mentions;
	}
}
