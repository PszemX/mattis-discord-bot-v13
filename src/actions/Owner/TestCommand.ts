import { BaseCommand } from '../../classes/BaseStructures/BaseCommand';
import { IEventData } from '../../typings';
import { compare } from '../../utilities/objectComparison';
import { guildDataModel } from '../../models/guildData';

export class TestCommand extends BaseCommand {
	public constructor() {
		super('test', 'command', {
			syntaxes: [[]],
			aliases: ['test'],
			cooldown: 1000,
			disable: false,
			devOnly: false,
			description: 'Testing developers things',
			category: 'ownerOnly',
			name: 'test',
			usage: '{prefix}test',
			// slash: SlashOption,
			// contextChat: string,
			// contextUser: string,
		});
	}

	public async execute(EventData: IEventData, parameters: any) {
		if (EventData.args.author.id == '345182514492604417') {
			const guild = EventData.args.guild;
			const guildSettings: any = await EventData.mattis.Database.guildsData(
				guild.id,
				'settings'
			).findOne({
				id: guild.id,
			});
			const comparison = compare(guildSettings, guildDataModel(guild));
			for (const key of Object.keys(comparison)) {
				if (comparison[key].type == 'created') {
					guildSettings[key] = comparison[key].data;
				}
			}
			console.log(guildSettings);
		}
		await EventData.args.delete();
	}
}
