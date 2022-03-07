import { BaseEventAction } from '../../classes/BaseStructures/BaseEventAction';
import { IEventData } from '../../typings';

export class EmojiVerificationAction extends BaseEventAction {
	public constructor() {
		super('emojiVerification', 'messageReactionAdd');
	}

	public async trigger(EventData: IEventData) {
		const actionSettings = EventData.guildCache.settings.actions[this.name];
		return (
			EventData.args[0].emoji.name == actionSettings.emoji &&
			EventData.args[0].message.id == actionSettings.messageId
		);
	}

	public async execute(EventData: IEventData) {
		const actionSettings = EventData.guildCache.settings.actions[this.name];
		const reactionGuild = EventData.mattis.guilds.cache.get(
			EventData.args[0].message.guildId
		);
		const reactionMember = reactionGuild?.members.cache.get(
			EventData.args[1].id
		);
		if (actionSettings.roleRemoveId) {
			const removeRole = actionSettings.roleRemoveId;
			await reactionMember?.roles.remove(removeRole);
		}
		if (actionSettings.roleAddId) {
			const addRole = actionSettings.roleAddId;
			await reactionMember?.roles.add(addRole);
		}
	}
}
