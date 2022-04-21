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
		const { member } = EventData.args;
		// Cached messages only including badwords written in set time.
		const filteredCache = EventData.guildCache.cacheManager
			.getMemberCache(member)
			.messages.filter(
				(cacheData: string) =>
					cacheData.split('.').includes('badwords') &&
					Date.now() - Number(cacheData.split('.').at(-1)) <
						settings.perMilisecondsTime
			);
		// Count all badwords in cached messages.
		const badwordsSum = filteredCache.reduce(
			(amount: number, cacheData: string) => {
				const splittedCache = cacheData.split('.');
				const index = splittedCache.indexOf('badwords');
				const badwordsAmount = Number(splittedCache.at(index + 1));
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
