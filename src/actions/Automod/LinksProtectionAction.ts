import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class LinksProtectionAction extends BaseEventAction {
	public constructor() {
		super('linksProtection', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		const { member } = EventData.args;
		const cachedMessagesWithLinks = EventData.guildCache.cacheManager
			.getMemberCache(member)
			.messages.filter(
				(cacheData: string) =>
					cacheData.split('.').includes('links') &&
					Date.now() - Number(cacheData.split('.').at(-1)) <
						settings.perMilisecondsTime
			);
		// console.log(cachedMessagesWithLinks);
		for (const message of cachedMessagesWithLinks) {
			// console.log(message.split('.'));
		}
		const enabledSites: string[] =
			Object.keys(settings.enableSites || {}).filter(
				(site) => settings.enableSites[site].enabled
			) || [];
		// console.log(enabledSites);
		return false;
	}

	public async execute(EventData: IEventData) {
		const settings = EventData.guildCache.settings.actions[this.name];
		EventData.args.delete();
		// Kara
	}
}
