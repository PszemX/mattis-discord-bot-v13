import express from 'express';
import { Mattis } from './Mattis';

export class HttpServer {
	private app = express();

	constructor(private mattis: Mattis) {}

	public async run() {
		this.app.get('/', (req: any, res: any) => {
			res.send('Mattis on!');
		});

		this.app.listen(process.env.PORT || 80);
	}
}
