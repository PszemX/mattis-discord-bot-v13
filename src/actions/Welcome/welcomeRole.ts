module.exports = {
	id: 'welcomeRole',
	event: 'guildMemberAdd',
	tags: {},
	isOnlyForHumans: true,
	trigger: async (data: any) => true,
	func: function (data: any) {
		data.args.roles.add(data.guildCache.settings.actions[this.id].roleId);
	},
};
