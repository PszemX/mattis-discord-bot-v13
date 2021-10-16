import { Client, ClientOptions } from "discord.js";
import { EventsHandler } from "../classes/EventsHandler";
import { createLogger } from "../utilities/logger";
import * as config from "../config";

export class Mattis extends Client {
	public readonly config = config;

	public readonly logger = createLogger("bot");

	public constructor(clientOptions: ClientOptions) {
		super(clientOptions);
	}

	public readonly events = new EventsHandler(this);

	async build(): Promise<this> {
		const start = Date.now();
		//this.events.load();
		this.on("ready", async () => {
			console.log(`Ready took ${Date.now() - start}`);
		});
		await this.login();
		return this;
	}
}
