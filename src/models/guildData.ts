import { Guild } from 'discord.js';
import { defaultPrefix, baseLanguage } from '../config';

export const guildDataModel = (guild: Guild) => {
	return {
		id: guild.id,
		name: guild.name,
		prefix: defaultPrefix,
		language: baseLanguage,
		actions: {
			welcomeChannelMessage: {
				enabled: false,
				channelId: '',
				text: '',
				deleteTime: 0,
			},
			welcomePrivateMessage: {
				enabled: false,
				text: '',
				deleteTime: 0,
			},
			welcomeRole: {
				enabled: false,
				roleId: '',
			},
			messageVerification: {
				enabled: false,
				messageText: '',
				messageChannelId: '',
				roleAddId: '',
				roleRemoveId: '',
			},
			emojiVerification: {
				enabled: false,
				messageId: '',
				emoji: '',
				roleAddId: '',
				roleRemoveId: '',
			},
			captchaVerification: {
				enabled: false,
				roleId: '',
			},
			ping: {
				enabled: false,
				aliases: ['ping'],
				cooldown: 3000,
			},
			covid: {
				enabled: false,
				aliases: ['covid'],
				cooldown: 3000,
			},
			rps: {
				enabled: false,
				aliases: ['rps'],
				cooldown: 3000,
			},
			reload: {
				enabled: true,
				aliases: ['reload'],
				cooldown: 3000,
			},
			sendMessageJob: {
				enabled: false,
				messageJobs: [
					{
						enabled: false,
						channelId: '',
						message: '',
						intervalTime: 2000,
						firstTimeSending: 0,
						lastTimeSent: 0,
					},
					{
						enabled: false,
						channelId: '',
						message: '',
						intervalTime: 1000,
						firstTimeSending: 0,
						lastTimeSent: 0,
					},
				],
			},
		},
	};
};
