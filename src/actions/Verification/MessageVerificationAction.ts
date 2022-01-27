import { BaseEventAction } from '../../classes/BaseEventAction';
import { IEventData } from '../../typings';

export class MessageVerificationAction extends BaseEventAction {
	public constructor() {
		super('messageVerification', 'messageCreate');
	}

	public async trigger(EventData: IEventData) {
		const actionSettings = EventData.guildCache.settings.actions[this.name];
		return (
			EventData.args.channelId == actionSettings.messageChannelId &&
			EventData.args.content == actionSettings.messageText
		);
	}

	public async execute(EventData: IEventData) {
		const actionSettings = EventData.guildCache.settings.actions[this.name];
		const messageGuild = EventData.mattis.guilds.cache.get(
			EventData.args.guildId
		);
		const messageMember = messageGuild?.members.cache.get(
			EventData.args.author.id
		);
		await EventData.args.delete();
		if (actionSettings.roleRemoveId) {
			const removeRole = actionSettings.roleRemoveId;
			await messageMember?.roles.remove(removeRole);
		}
		if (actionSettings.roleAddId) {
			const addRole = actionSettings.roleAddId;
			await messageMember?.roles.add(addRole);
		}
	}
}
