import { ColorResolvable, MessageEmbed } from 'discord.js';
import { BaseCommand } from '../classes/BaseCommand';
import * as colors from '../utilities/colors.json';
import { IEventData } from '../typings';

export class PingCommand extends BaseCommand {
	public constructor() {
		super('ping', 'command');
	}

	public async execute(EventData: IEventData, parameters: any) {
		const before = Date.now();
		const latency = Date.now() - before;
		const wsLatency = EventData.mattis.ws.ping.toFixed(0);
		const embed = new MessageEmbed()
			.setColor(<ColorResolvable>colors.blue)
			.setAuthor('🏓 PONG', EventData.mattis.user!.displayAvatarURL())
			.addFields(
				{
					name: '📶 **|** API',
					value: `**\`${latency}\`** ms`,
					inline: true,
				},
				{
					name: '🌐 **|** WebSocket',
					value: `**\`${wsLatency}\`** ms`,
					inline: true,
				}
			)
			.setFooter(
				`Aktualny ping ${EventData.mattis.user!.tag}`,
				EventData.mattis.user!.displayAvatarURL()
			)
			.setTimestamp();
		await EventData.args.channel.send({ embeds: [embed] });
	}
}
