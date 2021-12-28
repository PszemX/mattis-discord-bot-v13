import actionTextReplace from '../../utilities/actionTextReplace';

module.exports = {
	id: 'welcomeChannelMessage',
	event: 'guildMemberAdd',
	tags: {
		informative: true,
	},
	isOnlyForHumans: true,
	trigger: async (data: any) => true,
	func: async function (data: any) {
		data.args.guild.channels.cache
			.get(data.guildCache.settings.actions[this.id].channelId)
			.send(
				actionTextReplace(data, data.guildCache.settings.actions[this.id].text)
			);
	},
};
