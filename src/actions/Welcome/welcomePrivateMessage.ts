import actionTextReplace from '../../utilities/actionTextReplace';

module.exports = {
	id: 'welcomePrivateMessage',
	event: 'guildMemberAdd',
	tags: {
		informative: true,
	},
	isOnlyForHumans: true,
	trigger: async (data: any) => true,
	func: async function (data: any) {
		data.args.user.send(
			actionTextReplace(data, data.guildCache.settings.actions[this.id].text)
		);
	},
};
