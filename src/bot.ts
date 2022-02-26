import { Mattis } from './classes/Mattis';
import { clientOptions } from './config';

export const mattis = new Mattis(clientOptions);

process.on('exit', (code) => {
	console.log(`NodeJS process exited with code ${code}`);
});
process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT_EXCEPTION:', err);
	// console.log('Uncaught Exception detected. Restarting...');
	// process.exit(1);
});
process.on('warning', (warning) => {
	console.log('PROCESS_WARNING: ', warning);
});

mattis.build().catch((e) => mattis.Logger.error('PROMISE_ERR:', e));

// mattis.build().catch((e: any) => console.log('PROMISE_ERR:', e));
