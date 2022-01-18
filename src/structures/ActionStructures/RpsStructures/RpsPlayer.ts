import { Client, User } from 'discord.js';
import { RawUserData } from 'discord.js/typings/rawDataTypes';

export class RpsPlayer extends User {
	public points: Number = 0;
	public choice: string = '';

	constructor(client: Client, data: RawUserData) {
		super(client, data);
	}
}
