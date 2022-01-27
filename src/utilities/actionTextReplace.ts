const globalReplace = (text: String, replaceMap: Map<String, String>) => {
	for (let i = 0; i < text.length; ++i) {
		for (let replaceFrom of replaceMap.keys()) {
			let isValid = true;
			for (let i2 = 0; i2 < replaceFrom.length; ++i2) {
				if (text[i + i2] != replaceFrom[i2]) {
					isValid = false;
					break;
				}
			}
			if (isValid) {
				text =
					text.slice(0, i) +
					replaceMap.get(replaceFrom) +
					text.slice(i + replaceFrom.length);
				--i;
			}
		}
	}
	return text;
};

export const actionTextReplace = (data: any, text: string) => {
	let replaceMap = new Map([
		['$userName', data?.args.user?.username],
		['$userId', data?.args.user?.id],
		['$user', `<@${data?.args.user?.id}>`],
		['$oldUserName', data?.args.oldUser?.username],
		['$oldUserId', data?.args.oldUser?.id],
		['$oldUser', `<@${data?.args.oldUser?.id}>`],
		['$newUserName', data?.args.newUser?.username],
		['$newUserId', data?.args.newUser?.id],
		['$newUser', `<@${data?.args.newUser?.id}>`],
		['$messageId', data?.args.message?.id],
		['$messageContent', data?.args.message?.content],
		['$oldMessageId', data?.args.oldMessage?.id],
		['$oldMessageContent', data?.args.oldMessage?.content],
		['$newMessageId', data?.args.newMessage?.id],
		['$newMessageContent', data?.args.newMessage?.content],
		['$guildName', data?.args.guild?.name],
		['$guildId', data?.args.guild?.id],
		['$oldGuildName', data?.args.oldGuild?.name],
		['$oldGuildId', data?.args.oldGuild?.id],
		['$newGuildName', data?.args.newGuild?.name],
		['$newGuildId', data?.args.newGuild?.id],
		['$channelName', data?.args.channel?.name],
		['$channelId', data?.args.channel?.id],
		['$channelType', data?.args.channel?.type],
		['$channel', `<#${data?.args.channel}>`],
		['$oldChannelName', data?.args.oldChannel?.name],
		['$oldChannelId', data?.args.oldChannel?.id],
		['$oldChannel', `<#${data?.args.oldChannel}>`],
		['$newChannelName', data?.args.newChannel?.name],
		['$newChannelId', data?.args.newChannel?.id],
		['$newChannel', `<#${data?.args.newChannel}>`],
		['$roleName', data?.args.role?.name],
		['$roleId', data?.args.role?.id],
		['$roleColor', data?.args.role?.color],
		['$roleHexColor', data?.args.role?.hexColor],
		['$role', `<@&${data?.args.role?.id}>`],
		['$emojiName', data?.args.emoji?.name],
		['$emojiId', data?.args.emoji?.id],
		['$oldEmojiName', data?.args.oldEmoji?.name],
		['$oldEmojiId', data?.args.oldEmoji?.id],
		['$newEmojiName', data?.args.newEmoji?.name],
		['$newEmojiId', data?.args.newEmoji?.id],
		['$reactionName', data?.args.reaction?.emoji?.name],
		['$reactionId', data?.args.reaction?.emoji?.id],
		['$inviteAuthor', data?.args.invite?.inviter],
		['$inviteUrl', data?.args.invite?.url],
		['$inviteMaxUses', data?.args.invite?.maxUses],
		['$timestamp', data?.args.timestamp],
	]);
	return globalReplace(text, replaceMap);
};
