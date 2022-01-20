import { ActivityType, ClientPresenceStatus } from 'discord.js';

export interface IpresenceData {
	activities: { name: string; type: Exclude<ActivityType, 'CUSTOM'> }[];
	status: ClientPresenceStatus[];
	interval: number;
}
