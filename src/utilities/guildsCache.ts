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
				channelCreate: [],
				channelDelete: [],
				channelPinsUpdate: [],
				channelUpdate: [],
				emojiCreate: [],
				emojiDelete: [],
				emojiUpdate: [],
				guildBanAdd: [],
				guildBanRemove: [],
				guildCreate: [],
				guildDelete: [],
				guildIntegrationsUpdate: [],
				guildMemberAdd: [],
				guildMemberAvailable: [],
				guildMemberRemove: [],
				guildMembersChunk: [],
				guildMemberUpdate: [],
				guildUnavailable: [],
				guildUpdate: [],
				interactionCreate: [],
				inviteCreate: [],
				inviteDelete: [],
				messageCreate: [],
				messageDelete: [],
				messageDeleteBulk: [],
				messageReactionAdd: [],
				messageReactionRemove: [],
				messageReactionRemoveAll: [],
				messageReactionRemoveEmoji: [],
				messageUpdate: [],
				presenceUpdate: [],
				roleCreate: [],
				roleDelete: [],
				roleUpdate: [],
				stageInstanceCreate: [],
				stageInstanceDelete: [],
				stageInstanceUpdate: [],
				threadCreate: [],
				threadDelete: [],
				threadListSync: [],
				threadMembersUpdate: [],
				threadMemberUpdate: [],
				threadUpdate: [],
				typingStart: [],
				userUpdate: [],
				voiceStateUpdate: [],
				webhookUpdate: [],
			},
			commandsTree: <any>null,
			membersCache: {},
			channelsCache: {},
		};
		for (const actionId of Object.keys(guildCache.settings.actions)) {
			let actionSettings = guildCache.settings.actions[actionId];
			if (actionSettings.enabled) {
				let action = actions[actionId];
				guildCache.actionsByEvent[action.event].push(action);
			}
		}
		guildsCache[guildCache.settings.id] = guildCache;
		guildCache.commandsTree = createCommandsTree(guildCache);
		return guildsCache;
	},
	{}
);

export { guildsCache, directCache };
