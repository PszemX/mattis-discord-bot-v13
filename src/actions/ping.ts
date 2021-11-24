module.exports = {
	id: 'ping',
	event: 'command',
	tags: {
		funny: true,
	},
	slashOptions: [
		{
			name: 'ping',
			description: 'Sprawdź aktualny ping Mattisa',
			type: 1,
			options: [
				{
					name: 'user',
					description: 'User',
					type: 6,
					required: false,
				},
			],
		},
	],
	func: async function (data: any, parameters: any) {
		data.user.send('Komenda ping');
	},
};
