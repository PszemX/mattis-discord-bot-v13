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

	public async guildNamesList(): Promise<string[]> {
		const guildNames = (await this.db().admin().listDatabases()).databases
			.filter((db) => !isNaN(Number(db.name)))
			.map((db) => db.name);
		return guildNames;
	}

	public guildsData(guildId: string, collection: string) {
		return this.db(guildId).collection(collection);
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
