import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { ICachedMessageData, IEventData } from '../../typings';

export class BadwordsProtectionAction extends BaseEventAction {
	public constructor() {
		super('badwordsProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const { member } = EventData.args;
		// Cached messages only including badwords written in set time.
		const filteredCache = EventData.guildCache.cacheManager
			.getMemberCache(member)
			.messages.filter(
				(cacheData: ICachedMessageData) =>
					Date.now() - cacheData.timestamp < settings.perMilisecondsTime
			);
		// Count all badwords in cached messages.
		const badwordsSum = filteredCache.reduce(
			(amount: number, cacheData: ICachedMessageData) => {
				const badwordsAmount = cacheData.badwords.length;
				return amount + badwordsAmount;
			},
			0
		);
		return badwordsSum > settings.maxBadwordsCount;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		console.log('Badword');
		EventData.args.delete();
		// Kara
	}
}
