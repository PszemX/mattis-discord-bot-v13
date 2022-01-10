module.exports = {
	id: 'messageVerification',
	event: 'messageCreate',
	tags: {
		informative: true,
	},
	isOnlyForHumans: true,
	trigger: async function (data: any) {
		return (
			data.args.channelId ==
				data.guildCache.settings.actions[this.id].messageChannelId &&
			data.args.content == data.guildCache.settings.actions[this.id].messageText
		);
	},
	func: function (data: any) {
		data.args.delete();
		const messageMember = data.mattis.guilds.cache
			.get(data.args.guildId)
			.members.cache.get(data.args.author.id);
		if (data.guildCache.settings.actions[this.id].roleRemoveId) {
			messageMember.roles.remove(
				data.guildCache.settings.actions[this.id].roleRemoveId
			);
		}
		if (data.guildCache.settings.actions[this.id].roleAddId) {
			messageMember.roles.add(
				data.guildCache.settings.actions[this.id].roleAddId
			);
		}
	},
};
