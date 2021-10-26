import fs from 'fs';

const loadGuildsCache: any = () => {
	const files = fs.readdirSync('./dist/guildsData');
	const guildsData: any = {};
	for (const file of files) {
		const guildCache: any = {
			settings: require(`../guildsData/${file}`),
			actions: {
				guildMemberAdd: [],
			},
			commands: [],
			tasks: [],
			membersCache: {},
			channelsCache: {},
		};
		// Push enabled functions
		for (const attribute of ['actions', 'commands', 'tasks']) {
			const attributeSettings = guildCache.settings[attribute];
			for (const funcId of Object.keys(attributeSettings)) {
				const funcSettings = attributeSettings[funcId];
				if (funcSettings.enabled) {
					const func = require(`../functions/${attribute}/${funcId}`);
					if (attribute === 'actions') {
						guildCache.settings.actions[func.event].push(func);
					} else {
						guildCache.settings[attribute].push(func);
					}
				}
			}
		}
		// eslint-disable-next-line no-param-reassign
		guildsData[guildCache.settings.id] = guildCache;
	}
	return guildsData;
};

export default loadGuildsCache;
