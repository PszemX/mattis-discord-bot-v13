import { Message, User } from 'discord.js';
import latinize from 'latinize';
import uri from 'urijs';
import md5 from 'md5';
import { BaseEvent } from '../classes/BaseStructures/BaseEvent';
import badwords from '../utilities/badwords.json';
import { IEventData } from '../typings';

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
		await this.spamCache(EventData).then((result: string) => {
			// const a = this.linksCache(result, EventData);
			this.badwordsCache(result, EventData).then((result: string) => {
				this.emojiCache(result, EventData).then((result: string) => {
					this.capslockCache(result, EventData).then((result: string) => {
						EventData.guildCache.cacheManager
							.getMemberCache(EventData.args.member)
							.messages.push(result);
						console.log(result);
					});
				});
			});
		});
	}

	private async spamCache(EventData: IEventData): Promise<string> {
		const message = EventData.args;
		const { channel } = message;
		const timestamp = message.createdTimestamp;
		const hashedMessageData = `${md5(message.content)}.${timestamp}`;
		const cacheResult = `spam.${message.id}.${timestamp}`;
		EventData.guildCache.cacheManager
			.getChannelCache(channel)
			.messages.push(`sameMessages.${hashedMessageData}`);
		console.log(hashedMessageData);
		return cacheResult;
	}

	private async badwordsCache(
		cacheResult: string,
		EventData: IEventData
	): Promise<string> {
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
		const badwordsInMessage: string[] = [];
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
		if (badwordsInMessage.length) {
			// eslint-disable-next-line guard-for-in
			for (const badword of badwordsInMessage) {
				cacheResult = `${badword}.${cacheResult}`;
			}
			cacheResult = `badwords.${badwordsInMessage.length}.${cacheResult}`;
		}
		return cacheResult;
	}

	private async emojiCache(
		cacheResult: string,
		EventData: IEventData
	): Promise<string> {
		const settings = EventData.guildCache.settings.actions.emojiProtection;
		if (settings.enabled) {
			const outsideEmojiRegex = /(<a?)?:.+?:(\d{18}>)?/gi;
			const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
			const message = EventData.args
				.toString()
				.replace(outsideEmojiRegex, '️♥')
				.replace(emojiRegex, '♥')
				.replace(/️+/g, '');
			if (message.length <= settings.minMessageLength) return '';
			const messageWithoutEmojis = message.replace(/♥/g, '');
			const emojisAmout = message.length - messageWithoutEmojis.length;
			if ((emojisAmout / message.length) * 100 > settings.maxPercentage) {
				cacheResult = `emojis.${cacheResult}`;
			}
		}
		return cacheResult;
	}

	private async capslockCache(
		cacheResult: string,
		EventData: IEventData
	): Promise<string> {
		const settings = EventData.guildCache.settings.actions.capsLockProtection;
		if (settings.enabled) {
			const message = EventData.args.content;
			if (message.length <= settings.minMessageLength) return '';
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
				cacheResult = `capslock.${cacheResult}`;
			}
		}
		return cacheResult;
	}

	private async linksCache(
		cacheResult: string,
		EventData: IEventData
	): Promise<string> {
		// var result = uri.withinString(EventData.args.content, function (url) {
		// 	return url;
		// });
		// console.log(result);
		return cacheResult;
	}
}
