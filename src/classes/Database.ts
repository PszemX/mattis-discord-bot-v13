import { MongoClient } from 'mongodb';
import { createLogger } from './Managers/LogsManager';

/* The Database class is a MongoClient that has a method to connect to the database and a method to get the guilds data */
export class Database extends MongoClient {
	public readonly log = createLogger('Database');

	constructor() {
		super(process.env.MONGO_URI || '');
	}

	/**
	 * It connects to the database.
	 */
	public async makeConnection() {
		await this.connect()
			.then(() => {
				this.log.info('[Database] Succesfully connected to the Database!');
			})
			.catch((error) => this.log.error(error));
	}

	/**
	 * It returns a list of guild names.
	 * @returns An array of guild names.
	 */
	public async guildNamesList(): Promise<string[]> {
		return (await this.db().admin().listDatabases()).databases
			.filter((db) => !Number.isNaN(Number(db.name)))
			.map((db) => db.name);
	}

	/**
	 * Returns a reference to the specified collection in the specified guild
	 * @param {string} guildId - The ID of the guild you want to access.
	 * @param {string} collection - The name of the collection you want to access.
	 * @returns A MongoDB collection object.
	 */
	public guildsData(guildId: string, collection: string) {
		return this.db(guildId).collection(collection);
	}

	/**
	 * "Get the settings for a guild."
	 *
	 * The above function is a good example of how to use the `findOne` method
	 * @param {string} guildId - The ID of the guild you want to get the settings for.
	 * @returns A promise that resolves to a GuildSettings object.
	 */
	public guildSettings(guildId: string) {
		return this.guildsData(guildId, 'settings').findOne({ id: guildId });
	}

	public getLastCase() {}

	public saveCase() {}

	// private async databaseConnect() {
	// 	// Database -> guildsData, usersData itd...
	// 	// Collection -> id serwera, id użytkownika itd...

	// 	// const guildsData = this.db('guildsData');
	// 	// const usersData = this.db('usersData');

	// 	// const collection = guildsData.collection(userId);
	// 	// await collection.insertOne({ id: 2 });
	// }
}
