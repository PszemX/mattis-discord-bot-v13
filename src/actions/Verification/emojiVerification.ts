module.exports = {
	id: 'emojiVerification',
	event: 'messageReactionAdd',
	tags: {
		informative: true,
	},
	isOnlyForHumans: true,
	trigger: async function (data: any) {
		return (
			data.args[0].emoji.name ==
				data.guildCache.settings.actions[this.id].emoji &&
			data.args[0].message.id ==
				data.guildCache.settings.actions[this.id].messageId
		);
	},
	func: function (data: any) {
		const reactionMember = data.mattis.guilds.cache
			.get(data.args[0].message.guildId)
			.members.cache.get(data.args[1].id);
		if (data.guildCache.settings.actions[this.id].roleRemoveId)
			reactionMember.roles.remove(
				data.guildCache.settings.actions[this.id].roleRemoveId
			);
		if (data.guildCache.settings.actions[this.id].roleAddId)
			reactionMember.roles.add(
				data.guildCache.settings.actions[this.id].roleAddId
			);
	},
};
