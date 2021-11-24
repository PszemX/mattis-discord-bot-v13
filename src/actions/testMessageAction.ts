module.exports = {
	id: 'testMessageAction',
	event: 'messageCreate',
	tags: {
		informative: true,
	},
	isOnlyForHumans: true,
	trigger: async (data: any) => true,
	func: async function (data: any) {
		data.args.author.send(
			'Witaj! Aktualnie jestem testowany, więc jeżeli dostałeś tę wiadomość, to na nią nie odpowiadaj!'
		);
	},
};
