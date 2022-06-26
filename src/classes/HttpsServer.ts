import http from 'http';
import express from 'express';
import { Mattis } from './Mattis';

export class HttpServer {
	private app = express();

	constructor(private mattis: Mattis) {}

	public async run() {
		this.app.get('/', (req: any, res: any) => {
			res.send('Mattis on!');
		});
		setInterval(function () {
			http.get('http://mattis-discord-bot.herokuapp.com');
		}, 300000);

		this.app.listen(process.env.PORT || 80);
	}
}
