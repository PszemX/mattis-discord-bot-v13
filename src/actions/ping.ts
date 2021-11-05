module.exports = {
	id: 'ping',
	event: 'command',
	tags: {
		funny: true,
	},
	syntaxes: [[], [{ type: 'member', name: 'targetMember' }]],
	func: async function (data: any, parameters: any) {
		data.user.send('Komenda ping');
	},
};
