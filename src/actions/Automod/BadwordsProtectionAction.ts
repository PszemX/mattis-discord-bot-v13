import latinize from 'latinize';
import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import badwords from '../../utilities/badwords.json';
import { IBadwordData, IEventData } from '../../typings';

export class BadwordsProtectionAction extends BaseEventAction {
	public constructor() {
		super('badwordsProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const message = latinize(EventData.args.content.toLowerCase());
		const { length } = message;
		const { member } = EventData.args;
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
				const badwordData: IBadwordData = {
					badword,
					message: EventData.args,
					timestamp: Date.now(),
				};
				EventData.guildCache.cacheManager.getMemberCache(member).badWordsProtection.push(badwordData);
			}
		} else {
			return false;
		}
		return (
			EventData.guildCache.cacheManager.getMemberCache(member).badWordsProtection.filter(
				(badwordData: IBadwordData) => Date.now() - badwordData.timestamp < settings.perMilisecondsTime,
			).length > settings.maxBadwordsCount);
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		console.log('Badword');
		EventData.args.delete();
		// Kara
	}
}
