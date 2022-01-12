// import mongoose from 'mongoose';
// import * as config from '../config';
// import { createLogger } from '../structures/Logger';

// const log = createLogger('databaseManager');

// export const mongo = async () => {
// 	try {
// 		await mongoose.connect(config.mongoUri);
// 	} catch (error) {
// 		log.error(error);
// 	}
// 	return mongoose;
// };

// mongoose.connection.on('connected', () => {
// 	log.info('Succesfully connected to the Database!');
// });
