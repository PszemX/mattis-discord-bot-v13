import { readdirRecSync } from './reddirRecSync';
import { actions } from './actions';

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
	console.log(guildCommands);
	guildCommands.forEach((command: any) => {
		let commandSettings = guildCache.settings.actions[command.id];
		commandSettings.triggers.forEach((trigger: any) => {
			addCommandByTriggerToTree(command, trigger, tree);
		});
		if (command.tags.info && guildCache.settings.actions['info']?.enabled) {
			guildCache.settings.actions['info'].triggers.forEach(
				(infoTrigger: any) => {
					commandSettings.triggers.forEach((trigger: any) => {
						addCommandByTriggerToTree(
							command,
							infoTrigger + ' ' + trigger,
							tree
						);
					});
				}
			);
		}
	});
	return tree;
};

const guildsCache = readdirRecSync('./dist/guildsData').reduce(
	(guildsCache: any, filepath: any) => {
		let guildCache = {
			settings: require(`../guildsData/${filepath}`),
			actionsByEvent: <any>{
				command: [],
				messageReactionAdd: [],
				messageReactionRemove: [],
				messageCreate: [],
				messageDelete: [],
				guildMemberAdd: [],
				guildMemberRemove: [],
				voiceStateUpdate: [],
			},
			commandsTree: <any>null,
			membersCache: {},
			channelsCache: {},
		};
		Object.keys(guildCache.settings.actions).forEach((actionId) => {
			if (actionId == 'emojiRole' || actionId == 'messageRole') return;
			let actionSettings = guildCache.settings.actions[actionId];
			if (
				actionSettings.enabled ||
				((actionId == 'emojiRoleAdd' || actionId == 'emojiRoleRemove') &&
					guildCache.settings.actions['emojiRole'].enabled)
			) {
				let action = actions[actionId];
				guildCache.actionsByEvent[action.event].push(action);
			}
		});
		guildsCache[guildCache.settings.id] = guildCache;
		guildCache.commandsTree = createCommandsTree(guildCache);
		return guildsCache;
	},
	{}
);

export { guildsCache, directCache };
