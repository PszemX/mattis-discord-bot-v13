import { MessageMentions, Message } from 'discord.js';
import latinize from 'latinize';
import uri from 'urijs';
import md5 from 'md5';
import { BaseEvent } from '../classes/BaseStructures/BaseEvent';
import { IEventData, ICachedMessageData } from '../typings';
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
		if (!message.member) return;
		const EventData: IEventData = this.mattis.utils.getEventData(message);
		await this.cacheMessage(EventData);
		const { guildCache } = EventData;
		if (message.content.startsWith(guildCache.settings.prefix)) {
			await this.mattis.Actions.handleCommand(EventData);
		}
	}

	private async cacheMessage(EventData: IEventData): Promise<void> {
		const message: Message = EventData.args;
		const { length } = this.mattis.utils.convertTextToArray(message.content);
		const cachedMessageData: ICachedMessageData = {
			id: message.id,
			messageLength: length,
			channelId: message.channelId,
			content: md5(message.content),
			badwords: await this.badwordsCache(EventData),
			capslock: await this.capslockCache(EventData),
			emojis: await this.emojisCache(EventData),
			links: await this.linksCache(EventData),
			mentions: await this.mentionsCache(EventData),
			zalgos: await this.zalgosCache(EventData),
			spoilers: await this.spoilersCache(EventData),
			files: await this.fileTypesCache(EventData),
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
		if (/*settings.enabled*/ true) {
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
		if (/*settings.enabled*/ true) {
			const message: string[] = this.mattis.utils.convertTextToArray(
				EventData.args.content
			);
			if (message.length < settings.minMessageLength) {
				return capslockAmount;
			}
			const capslock = message.filter((i) => i.match(/[A-Z]/g)) || [];
			capslockAmount = capslock.length;
		}
		return capslockAmount;
	}

	private async emojisCache(EventData: IEventData): Promise<number> {
		let emojisAmout = 0;
		const settings = EventData.guildCache.settings.actions.emojiProtection;
		if (/*settings.enabled*/ true) {
			const emojiRegex =
				/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
			const message: string[] = this.mattis.utils.convertTextToArray(
				EventData.args.content
			);
			if (message.length <= settings.minMessageLength) return emojisAmout;
			const emojis = message.filter((i) => i.match(emojiRegex));
			emojisAmout = emojis.length;
		}
		return emojisAmout;
	}

	private async linksCache(EventData: IEventData): Promise<string[]> {
		const links: string[] = [];
		const settings = EventData.guildCache.settings.actions.linksProtection;
		if (/*settings.enabled*/ true) {
			// @ts-ignore
			uri.withinString(EventData.args.content, (u) => links.push(u) && u);
		}
		return links;
	}

	private async mentionsCache(EventData: IEventData): Promise<string[]> {
		let mentions: string[] = [];
		const settings = EventData.guildCache.settings.actions.massPingProtection;
		if (/*settings.enabled*/ true) {
			const message: Message = EventData.args;
			const {
				USERS_PATTERN,
				CHANNELS_PATTERN,
				ROLES_PATTERN,
				EVERYONE_PATTERN,
			} = MessageMentions;
			const matchedMentions: RegExpMatchArray[] = [
				...message.content.matchAll(USERS_PATTERN),
				...message.content.matchAll(CHANNELS_PATTERN),
				...message.content.matchAll(ROLES_PATTERN),
				...message.content.matchAll(EVERYONE_PATTERN),
			];
			mentions = matchedMentions.map((i) => i[0]);
		}
		return mentions;
	}

	private async zalgosCache(EventData: IEventData): Promise<number> {
		let zalgosAmount = 0;
		const settings = EventData.guildCache.settings.actions.zalgosProtection;
		if (/*settings.enabled*/ true) {
			const message: string[] = this.mattis.utils.convertTextToArray(
				EventData.args.content
			);
			if (message.length < settings.minMessageLength) {
				return zalgosAmount;
			}
			const zalgos = message.filter((i) => i.match(/\p{M}{3,}/u)) || [];
			zalgosAmount = zalgos.length;
		}
		return zalgosAmount;
	}

	private async spoilersCache(EventData: IEventData): Promise<number> {
		let spoilersAmount = 0;
		// const settings = EventData.guildCache.settings.actions.spoilersProtection;
		if (/*settings.enabled*/ true) {
			const message: string = EventData.args.content;
			const matchedSpoilers = [...message.matchAll(/\|\|.+?\|\|/gi)] || [];
			const spoilers = matchedSpoilers.map((i) => i[0]);
			spoilersAmount = spoilers.length;
		}
		return spoilersAmount;
	}

	private async fileTypesCache(EventData: IEventData): Promise<string[]> {
		let files: string[] = [];
		const settings = EventData.guildCache.settings.actions.fileTypesProtection;
		if (/*settings.enabled*/ true) {
			const message: Message = EventData.args;
			files = message.attachments.map((i) => i.id);
		}
		return files;
	}
}
