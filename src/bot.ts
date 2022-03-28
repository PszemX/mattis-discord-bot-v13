import { Mattis } from './classes/Mattis';

export const mattis = new Mattis();

process.on('exit', (code) => {
	console.log(`NodeJS process exited with code ${code}`);
});
process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT_EXCEPTION:', err);
});
process.on('warning', (warning) => {
	console.log('PROCESS_WARNING: ', warning);
});

mattis.build().catch((e) => mattis.Logger.error('PROMISE_ERR:', e));
