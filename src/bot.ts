import { Mattis } from './structures/Mattis';

export const mattis = new Mattis();

process.on('exit', (code) => {
	console.log(`NodeJS process exited with code ${code}`);
});
process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT_EXCEPTION:', err);
	console.log('Uncaught Exception detected. Restarting...');
	process.exit(1);
});
process.on('warning', (warning) => {
	console.log('PROCESS_WARNING: ', warning);
});

// mattis.build().catch((e: any) => console.log('PROMISE_ERR:', e));
