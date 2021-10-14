import { Client, ClientOptions } from "discord.js";
import * as config from "../config";

export class Mattis extends Client {
	public readonly config = config;

	public constructor(clientOptions: ClientOptions) {
		super(clientOptions);
	}

	public async build(): Promise<this> {
		const start = Date.now();
		this.on("ready", async () => {
			console.log(`Ready took ${Date.now() - start}`);
		});
		await this.login();
		return this;
	}
}
