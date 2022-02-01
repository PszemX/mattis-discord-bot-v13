import { RpsGame } from '../../../classes/ActionStructures/RpsGame';
import { GuildMember, TextChannel, User } from 'discord.js';
import { BaseCommand } from '../../../classes/BaseCommand';
import { IEventData } from '../../../typings';

export class RpsGameCommand extends BaseCommand {
	public constructor() {
		super('rps', 'command', {
			syntaxes: [
				[],
				[{ type: 'natural', name: 'maxPoints' }],
				[{ type: 'member', name: 'targetMember' }],
				[
					{ type: 'member', name: 'targetMember' },
					{ type: 'natural', name: 'maxPoints' },
				],
			],
			aliases: ['rps'],
			cooldown: 1000,
			disable: false,
			devOnly: false,
			description: "Play 'rock, paper, scissors' game.",
			category: 'game',
			name: 'rps',
			usage: '{prefix}rps',
			//slash: SlashOption,
			//contextChat: string,
			//contextUser: string,
		});
	}

	public async execute(EventData: IEventData, parameters: any) {
		const playerOne: User = EventData.args.member.user;
		const playerTwo: GuildMember = parameters.targetMember;
		const gameChannel: TextChannel = EventData.args.channel;
		let opponent: User = EventData.mattis.user!;
		if (playerTwo) {
			if (playerTwo == EventData.args.member.id) {
				return;
			}
			opponent = playerTwo.user;
		}

		let maxPoints: Number = 1;
		if (parameters.maxPoints) maxPoints = parameters.maxPoints;
		// console.log('PLAYERONE: ', playerOne);
		// console.log('GAMECHANNEL: ', gameChannel);
		// console.log('MAXPOINTS: ', maxPoints);
		// console.log('EVENTDATA: ', EventData);
		// console.log('OPPONENT: ', opponent);

		new RpsGame(playerOne, opponent, gameChannel, maxPoints, EventData);
	}
}
