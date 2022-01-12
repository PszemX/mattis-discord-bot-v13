import { createLogger } from './Logger';
import { MongoClient } from 'mongodb';
import { mongoUri } from '../config';

export class Database extends MongoClient {
	public readonly log = createLogger('Database');

	constructor() {
		super(mongoUri);
	}

	// private async databaseConnect() {
	// 	// Database -> guildsData, usersData itd...
	// 	// Collection -> id serwera, id użytkownika itd...

	// 	// const guildsData = this.db('guildsData');
	// 	// const usersData = this.db('usersData');

	// 	// const collection = guildsData.collection(userId);
	// 	// await collection.insertOne({ id: 2 });
	// }
}
