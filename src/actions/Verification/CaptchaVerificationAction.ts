// TODO
import { DMChannel, Message, MessageEmbed, User } from 'discord.js';
import { BaseEventAction } from '../../classes/BaseEventAction';
import { IEventData } from '../../typings';
import lang from '../../utilities/lang';

export class CaptchaVerificationAction extends BaseEventAction {
	public constructor() {
		super('captchaVerification', 'guildMemberAdd');
	}

	public async trigger(EventData: IEventData) {
		return true;
	}

	public async execute(EventData: IEventData) {
		const captchaCode = this.createCode();
		const captchaEmbed = this.createEmbed(EventData, captchaCode);
		const user: User = EventData.args.user;
		try {
			const userDirectMessage: DMChannel = await user.createDM();
			await userDirectMessage.send({ embeds: [captchaEmbed] });
			const filter = (message: Message) => {
				return message.author.id == user.id;
			};
			const collector = userDirectMessage.createMessageCollector({
				filter,
				max: 3,
				time: 300000,
			});
			collector.on('collect', (message: Message) => {
				console.log(message);
				if (message.content == captchaCode) {
					const actionSettings =
						EventData.guildCache.settings.actions[this.name];
					const role = actionSettings.roleAddId;
					EventData.args.roles.add(role);
				}
			});
		} finally {
		}
	}

	private createCode(): string {
		const numbers: string = '1234567890';
		const lowercase: string = 'abcdefghijklmnopqrstuvwxyz';
		const uppercase: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const chars: string = numbers + lowercase + uppercase;
		const code: string[] = [];
		for (let i = 0; i < 6; i++) {
			code.push(chars.charAt(Math.floor(Math.random() * chars.length)));
		}
		return code.join('');
	}

	private createEmbed(EventData: IEventData, code: string): MessageEmbed {
		const title = lang(
			'actions.captchaVerification.captchaEmbed.title',
			EventData
		);
		const description = lang(
			'actions.captchaVerification.captchaEmbed.description',
			EventData,
			{ user: EventData.args.user, guild: EventData.args.guild, captcha: code }
		);
		const footer = lang(
			'actions.captchaVerification.captchaEmbed.footer',
			EventData
		);

		const embed = new MessageEmbed()
			.setAuthor(title, EventData.args.displayAvatarURL())
			.setDescription(description)
			.setFooter(footer)
			.setThumbnail(EventData.args.guild.iconURL())
			.setTimestamp();

		return embed;
	}
}
