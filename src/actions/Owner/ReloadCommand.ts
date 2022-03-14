import { BaseCommand } from '../../classes/BaseStructures/BaseCommand';
import { IEventData } from '../../typings';

export class ReloadCommand extends BaseCommand {
	public constructor() {
		super('reload', 'command', {
			syntaxes: [[]],
			aliases: ['reload'],
			cooldown: 1000,
			disable: false,
			devOnly: false,
			description: 'Reload guildsData of current server',
			category: 'ownerOnly',
			name: 'ping',
			usage: '{prefix}reload',
			// slash: SlashOption,
			// contextChat: string,
			// contextUser: string,
		});
	}

	public async execute(EventData: IEventData, parameters: any) {
		if (EventData.args.author.id == '345182514492604417') {
			const { guildId } = EventData.args;
			await EventData.mattis.Guilds.updateGuildsData(guildId);
		}
		await EventData.args.delete();
	}
}
