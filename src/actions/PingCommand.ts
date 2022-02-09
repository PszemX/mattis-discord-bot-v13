import { ColorResolvable, MessageEmbed } from 'discord.js';
import { BaseCommand } from '../classes/BaseCommand';
import * as colors from '../utilities/colors.json';
import { IEventData } from '../typings';
import lang from '../utilities/lang';

export class PingCommand extends BaseCommand {
	public constructor() {
		super('ping', 'command', {
			syntaxes: [[]],
			aliases: ['ping'],
			cooldown: 1000,
			disable: false,
			devOnly: false,
			description: "Show the current client's ping.",
			category: 'general',
			name: 'ping',
			usage: '{prefix}ping',
			//slash: SlashOption,
			//contextChat: string,
			//contextUser: string,
		});
	}

	public async execute(EventData: IEventData, parameters: any) {
		const before = Date.now();
		const latency = Date.now() - before;
		const wsLatency = EventData.mattis.ws.ping.toFixed(0);
		const vcLatency = 0;
		const embed = new MessageEmbed()
			.setColor(this.searchHex(wsLatency))
			.setAuthor('🏓 PONG', EventData.mattis.user!.displayAvatarURL())
			.addFields(
				{
					name: '📶 API',
					value: `**\`${latency}\`** ms`,
					inline: true,
				},
				{
					name: '🌐 WebSocket',
					value: `**\`${wsLatency}\`** ms`,
					inline: true,
				},
				{
					name: '🔊 Voice',
					value: `**\`${vcLatency}\`** ms`,
					inline: true,
				}
			)
			.setFooter(
				lang('actions.ping.footer', EventData),
				EventData.mattis.user!.displayAvatarURL()
			)
			.setTimestamp();
		await EventData.args.channel.send({ embeds: [embed] });
	}

	private searchHex(ms: number | string): ColorResolvable {
		const listColorHex = [
			[0, 20, 'GREEN'],
			[21, 50, 'GREEN'],
			[51, 100, 'YELLOW'],
			[101, 150, 'YELLOW'],
			[150, 200, 'RED'],
		];

		const defaultColor = 'RED';

		const min = listColorHex.map((e) => e[0]);
		const max = listColorHex.map((e) => e[1]);
		const hex = listColorHex.map((e) => e[2]);
		let ret: number | string = '#000000';

		for (let i = 0; i < listColorHex.length; i++) {
			if (min[i] <= ms && ms <= max[i]) {
				ret = hex[i];
				break;
			} else {
				ret = defaultColor;
			}
		}
		return ret as ColorResolvable;
	}
}
