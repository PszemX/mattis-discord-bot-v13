import { JobsManager } from './Managers/JobsManager';
import { CacheManager } from './Managers/CacheManager';
import { guildCacheLastDuration, guildCacheLastInterval } from '../config';

export class GuildCache {
	public settings: any;
	public actionsByEvent: any = {
		command: [],
		job: [],
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
	};
	public commandsTree: any = null;
	public jobs: JobsManager | undefined;
	public cacheManager = new CacheManager();
	constructor(guildSettings: any) {
		this.settings = guildSettings;
		this.cleanCacheManager();
	}
	private cleanCacheManager() {
		setInterval(() => {
			this.cacheManager.cleanCaches();
		}, guildCacheLastInterval);
	}
}
