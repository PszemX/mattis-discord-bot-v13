import { ColorResolvable, MessageEmbed } from 'discord.js';
import { BaseCommand } from '../../classes/BaseCommand';
import * as colors from '../../utilities/colors.json';
import { IEventData } from '../../typings';
import lang from '../../utilities/lang';
import { updateGuildsData } from '../../utilities/updateGuildsData';

export class ReloadCommand extends BaseCommand {
	public constructor() {
		super('reload', 'command', {
			syntaxes: [[]],
			aliases: ['reload'],
			cooldown: 1000,
			disable: false,
			devOnly: false,
			description: 'Reload guildsData of current server',
			category: 'general',
			name: 'ping',
			usage: '{prefix}reload',
			//slash: SlashOption,
			//contextChat: string,
			//contextUser: string,
		});
	}

	public async execute(EventData: IEventData, parameters: any) {
		if (EventData.args.author.id == '345182514492604417') {
			const guildId = EventData.args.guildId;
			await EventData.mattis.Guilds.updateGuildsData(guildId);
		}
		await EventData.args.delete();
	}
}
