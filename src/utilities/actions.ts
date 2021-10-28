import { readdirRecSync } from '../utilities/reddirRecSync';

export const actions = readdirRecSync('./dist/actions').reduce(
	(actions: any, path: any) => {
		let action = require('../actions/' + path);
		actions[action.id] = action;
		return actions;
	},
	{}
);
