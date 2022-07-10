import { BaseCommand } from '../../classes/BaseStructures/BaseCommand';
import { IEventData } from '../../typings';
import { guildDataDefaultModel } from '../../models/guildDataDefault';
import {
	diff,
	addedDiff,
	deletedDiff,
	updatedDiff,
	detailedDiff,
} from 'deep-object-diff';

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
			const guildSettings: any = await EventData.mattis.Database.guildSettings(
				guild.id
			);
			const changed = this.changedObject(
				guildSettings,
				guildDataDefaultModel(guild)
			);
			await EventData.mattis.Guilds.updateDatabaseGuildSettings(guild.id);
		}
		await EventData.args.delete();
	}

	private changedObject(objectOne: any, objectTwo: any) {
		// Based on whole guildsData.ts object.
		let changed: any = {};
		for (const key in objectTwo) {
			if (Array.isArray(objectTwo[key])) {
				changed[key] =
					objectOne[key] == undefined ? objectTwo[key] : objectOne[key];
			} else if (typeof objectTwo[key] === 'object') {
				if (objectOne[key] == undefined) {
					changed[key] = objectTwo[key];
				} else {
					changed[key] = this.changedObject(objectOne[key], objectTwo[key]);
				}
			} else {
				changed[key] =
					objectOne[key] == undefined ? objectTwo[key] : objectOne[key];
			}
		}
		// // Based only on new things in settings.
		// let changed: any = objectOne;
		// const comparison: any = addedDiff(objectOne, objectTwo);
		// for (const key in comparison) {
		// 	if (typeof comparison[key] === 'object') {
		// 		if (objectOne[key] == undefined) objectOne[key] = {};
		// 		changed[key] = this.changedObject(objectOne[key], objectTwo[key]);
		// 	} else {
		// 		changed[key] = comparison[key];
		// 	}
		// }
		return changed;
	}
}
