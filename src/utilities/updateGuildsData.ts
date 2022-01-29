import { GuildCache } from '../classes/GuildCache';
import { Mattis } from '../classes/Mattis';

const directCache = {
	actionsByEvent: {
		command: [],
		messageReactionAdd: [],
		messageReactionRemove: [],
		message: [],
		messageDelete: [],
	},
	settings: {},
	commandsTree: null,
};

const addCommandByTriggerToTree = (command: any, trigger: any, tree: any) => {
	let splittedTrigger = trigger.split(' ');
	let branch = tree;
	splittedTrigger.forEach((branchName: any) => {
		if (!branch.b) branch.b = {};
		if (!branch.b[branchName]) branch.b[branchName] = { b: null, c: null };
		branch = branch.b[branchName];
	});
	branch.c = command;
};

const createCommandsTree = (guildCache: any) => {
	let tree = { b: null, c: null };
	let guildCommands = guildCache.actionsByEvent['command'];
	guildCommands.forEach((command: any) => {
		let commandSettings = guildCache.settings.actions[command.name];
		commandSettings.aliases.forEach((trigger: any) => {
			addCommandByTriggerToTree(command, trigger, tree);
		});
	});
	return tree;
};

const updateGuildsData = async (Mattis: Mattis, guildSettings: any) => {
	const guildCache = new GuildCache(guildSettings);
	for (const actionName of Object.keys(guildCache.settings.actions)) {
		let actionSettings = guildCache.settings.actions[actionName];
		if (actionSettings.enabled) {
			let action = Mattis.Actions.get(actionName);
			if (action) guildCache.actionsByEvent[action.event].push(action);
		}
	}
	guildCache.commandsTree = createCommandsTree(guildCache);
	return guildCache;
};

export { updateGuildsData };
