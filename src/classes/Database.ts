import { createLogger } from './LogsManager';
import { MongoClient } from 'mongodb';

export class Database extends MongoClient {
	public readonly log = createLogger('Database');

	constructor() {
		super(process.env.MONGO_URI || '');
	}

	public async makeConnection() {
		await this.connect()
			.then(() => {
				this.log.info('[Database] Succesfully connected to the Database!');
			})
			.catch((error) => this.log.error(error));
	}

	public guildsData(collection: string) {
		return this.db('guildsData').collection(collection);
	}

	public usersData(collection: string) {
		return this.db('usersData').collection(collection);
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
