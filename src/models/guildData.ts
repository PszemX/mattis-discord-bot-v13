import { Guild } from 'discord.js';
import { defaultPrefix, baseLanguage } from '../config';

export const guildDataModel = (guild: Guild) => {
	return {
		id: guild.id,
		name: guild.name,
		prefix: defaultPrefix,
		language: baseLanguage,
		commandPrompting: 'true',
		rolePermissions: {
			'705921111635919048': 1,
			'744300250851835975': 2,
			'716439596447039538': 3,
			'716313197136838678': 4,
			'716439185560436738': 5,
			'716438986410819615': 6,
			'512413793104429077': 10,
			'716805633755709460': 10,
			'716062861746765877': 10,
		},
		warnsStorage: {
			punishments: {
				1: {
					vmute: false,
					joinBlock: false,
					tempmute: true,
					mute: false,
					kick: false,
					tempban: false,
					ban: false,
					tempsoftban: false,
					softban: false,
				},
				7: {
					vmute: false,
					joinBlock: false,
					tempmute: false,
					mute: false,
					kick: false,
					tempban: true,
					ban: false,
					tempsoftban: false,
					softban: false,
				},
			},
			deleteWarnTime: 0,
		},
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
			test: {
				enabled: true,
				aliases: ['test'],
				cooldown: 3000,
			},
			sendMessageJob: {
				enabled: false,
				messageJobs: [
					{
						enabled: false,
						id: 1,
						channelId: '',
						message: '',
						intervalTime: 2000,
						firstTimeSending: 0,
						lastTimeSent: 0,
					},
				],
			},
			emojiProtection: {
				enabled: false,
				ignoredRoles: [],
				ignoredChannels: [],
				wordLongerThan: 9,
				maxPercentage: 70,
				punishment: {
					delete: false,
					warn: false,
					vmute: false,
					joinBlock: false,
					tempmute: false,
					mute: false,
					kick: false,
					tempban: false,
					ban: false,
					tempsoftban: false,
					softban: false,
				},
				response: {
					directMessage: {
						enabled: false,
						type: {
							message: {
								enabled: false,
								text: 'emoji DM Message',
							},
							embed: {
								enabled: false,
								author: '',
								title: '',
								url: '',
								description: 'emoji DM Embed',
								color: 'RED',
								thumbnail: '',
								image: '',
								fields: [],
								footer: '',
								timestamp: true,
							},
						},
						deletingTime: 0,
					},
					channelMessage: {
						enabled: false,
						type: {
							message: {
								enabled: false,
								text: 'emoji channel Message',
							},
							embed: {
								enabled: false,
								author: '',
								title: 'emoji channel Embed',
								url: '',
								description: '',
								color: 'RED',
								thumbnail: '',
								image: '',
								fields: [],
								footer: '',
								timestamp: true,
							},
						},
						deletingTime: 0,
					},
				},
			},
			capsLockProtection: {
				enabled: false,
				ignoredRoles: [],
				ignoredChannels: [],
				wordLongerThan: 9,
				maxPercentage: 70,
				punishment: {
					delete: false,
					warn: false,
					vmute: false,
					joinBlock: false,
					tempmute: false,
					mute: false,
					kick: false,
					tempban: false,
					ban: false,
					tempsoftban: false,
					softban: false,
				},
				response: {
					directMessage: {
						enabled: false,
						type: {
							message: {
								enabled: false,
								text: 'capsLock DM Message',
							},
							embed: {
								enabled: false,
								author: '',
								title: '',
								url: '',
								description: 'capsLock DM Embed',
								color: 'RED',
								thumbnail: '',
								image: '',
								fields: [],
								footer: '',
								timestamp: true,
							},
						},
						deletingTime: 0,
					},
					channelMessage: {
						enabled: false,
						type: {
							message: {
								enabled: false,
								text: 'capsLock channel Message',
							},
							embed: {
								enabled: false,
								author: '',
								title: 'capsLock channel Embed',
								url: '',
								description: '',
								color: 'RED',
								thumbnail: '',
								image: '',
								fields: [],
								footer: '',
								timestamp: true,
							},
						},
						deletingTime: 0,
					},
					badwordsProtection: {
						enabled: false,
						ignoredRoles: [],
						ignoredChannels: [],
						maxBadwordsCount: 3,
						perMilisecondsTime: 15000,
						punishment: {
							delete: false,
							warn: false,
							vmute: false,
							joinBlock: false,
							tempmute: false,
							mute: false,
							kick: false,
							tempban: false,
							ban: false,
							tempsoftban: false,
							softban: false,
						},
						response: {
							directMessage: {
								enabled: false,
								type: {
									message: {
										enabled: true,
										text: 'Uważaj na przekleństwa!',
									},
									embed: {
										enabled: false,
										author: '',
										title: '',
										url: '',
										description: 'UserProtection DM Embed',
										color: 'RED',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
							channelMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Uważaj na przekleństwa!',
									},
									embed: {
										enabled: false,
										author: '',
										title: 'UserProtection Embed',
										url: '',
										description: '',
										color: 'BLACK',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
						},
					},
					channelsChangingProtection: {
						enabled: false,
						ignoredRoles: [],
						ignoredChannels: [],
						maxChannels: 5,
						perMilisecondsTime: 9000,
						punishment: {
							delete: false,
							warn: false,
							vmute: false,
							joinBlock: false,
							tempmute: false,
							mute: false,
							kick: false,
							tempban: false,
							ban: false,
							tempsoftban: false,
							softban: false,
						},
						response: {
							directMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Nie skacz tak po kanałach!',
									},
									embed: {
										enabled: false,
										author: '',
										title: '',
										url: '',
										description: 'UserProtection DM Embed',
										color: 'RED',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
							channelMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Uważaj na przekleństwa!',
									},
									embed: {
										enabled: false,
										author: '',
										title: 'UserProtection Embed',
										url: '',
										description: '',
										color: 'BLACK',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
						},
					},
					sameMessagesProtection: {
						enabled: false,
						ignoredRoles: [],
						ignoredChannels: [],
						minMsgLen: 10,
						maxAmount: 3,
						perMilisecondsTime: 100000,
						punishment: {
							delete: false,
							warn: false,
							vmute: false,
							joinBlock: false,
							tempmute: false,
							mute: false,
							kick: false,
							tempban: false,
							ban: false,
							tempsoftban: false,
							softban: false,
						},
						response: {
							directMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Uważaj na przekleństwa!',
									},
									embed: {
										enabled: false,
										author: '',
										title: '',
										url: '',
										description: 'UserProtection DM Embed',
										color: 'RED',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: null,
							},
							channelMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Te same wiadomości zostały napisane!',
									},
									embed: {
										enabled: false,
										author: '',
										title: 'UserProtection Embed',
										url: '',
										description: '',
										color: 'BLACK',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
						},
					},
					linksProtection: {
						enabled: false,
						ignoredRoles: [],
						ignoredChannels: ['704821116220342352'],
						maxMessages: 3,
						perMilisecondsTime: 20000,
						enableSites: {
							google: {
								enabled: true,
							},
							facebook: {
								enabled: false,
							},
							messenger: {
								enabled: false,
							},
							youtube: {
								enabled: false,
							},
							instagram: {
								enabled: false,
							},
							twitch: {
								enabled: false,
							},
							twitter: {
								enabled: false,
							},
							reddit: {
								enabled: false,
							},
							wikipedia: {
								enabled: false,
							},
							discord: {
								enabled: false,
							},
						},
						punishment: {
							delete: false,
							warn: false,
							vmute: false,
							joinBlock: false,
							tempmute: false,
							mute: false,
							kick: false,
							tempban: false,
							ban: false,
							tempsoftban: false,
							softban: false,
						},
						response: {
							directMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Uważaj na przekleństwa!',
									},
									embed: {
										enabled: false,
										author: '',
										title: '',
										url: '',
										description: 'UserProtection DM Embed',
										color: 'RED',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: null,
							},
							channelMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Nie wysyłaj linków!',
									},
									embed: {
										enabled: false,
										author: '',
										title: 'UserProtection Embed',
										url: '',
										description: '',
										color: 'BLACK',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
						},
					},
					spamProtection: {
						enabled: false,
						ignoredRoles: ['704964926325653565'],
						ignoredChannels: [],
						maxMessages: 5,
						perMilisecondsTime: 15000,
						punishment: {
							delete: false,
							warn: false,
							vmute: false,
							joinBlock: false,
							tempmute: false,
							mute: false,
							kick: false,
							tempban: false,
							ban: false,
							tempsoftban: false,
							softban: false,
						},
						response: {
							directMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Uważaj na przekleństwa!',
									},
									embed: {
										enabled: false,
										author: '',
										title: '',
										url: '',
										description: 'UserProtection DM Embed',
										color: 'RED',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
							channelMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Nie spamuj!',
									},
									embed: {
										enabled: false,
										author: '',
										title: 'UserProtection Embed',
										url: '',
										description: '',
										color: 'BLACK',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
						},
					},
					massPingProtection: {
						enabled: false,
						ignoredRoles: [],
						ignoredChannels: [],
						maxMentionsCount: 4,
						perMilisecondsTime: 10000,
						punishment: {
							delete: false,
							warn: false,
							vmute: false,
							joinBlock: false,
							tempmute: false,
							mute: false,
							kick: false,
							tempban: false,
							ban: false,
							tempsoftban: false,
							softban: false,
						},
						enableMentions: {
							channels: {
								enabled: false,
								maxMentionsCount: 2,
								perMilisecondsTime: 3000,
								ignoredRoles: [],
								ignoredChannels: [],
							},
							members: {
								enabled: false,
								maxMentionsCount: 3,
								perMilisecondsTime: 10000,
								ignoredRoles: [],
								ignoredChannels: [],
							},
							roles: {
								enabled: false,
								maxMentionsCount: 2,
								perMilisecondsTime: 3000,
								ignoredRoles: [],
								ignoredChannels: [],
							},
							everyone: {
								enabled: false,
								maxMentionsCount: 1,
								perMilisecondsTime: 3000,
								ignoredRoles: ['709844560595124234'],
								ignoredChannels: [],
							},
						},
						response: {
							directMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Uważaj na przekleństwa!',
									},
									embed: {
										enabled: false,
										author: '',
										title: '',
										url: '',
										description: 'UserProtection DM Embed',
										color: 'RED',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
							channelMessage: {
								enabled: false,
								type: {
									message: {
										enabled: false,
										text: 'Nie pinguj tylu osób!',
									},
									embed: {
										enabled: false,
										author: '',
										title: 'UserProtection Embed',
										url: '',
										description: '',
										color: 'BLACK',
										thumbnail: '',
										image: '',
										fields: [],
										footer: '',
										timestamp: true,
									},
								},
								deletingTime: 0,
							},
						},
					},
				},
			},
		},
	};
};
