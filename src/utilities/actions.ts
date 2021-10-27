import { readdirRecSync } from '../utilities/reddirRecSync';
const fs = require('fs');

const actions = fs
	.readdirRecSync(__dirname + '/../actions')
	.reduce((actions: any, path: any) => {
		let action = require('../actions/' + path);
		actions[action.id] = action;
		return actions;
	}, {});

export { actions };
