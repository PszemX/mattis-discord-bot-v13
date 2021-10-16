import fs from "fs";
import { Mattis } from "./Mattis";

export class EventsHandler {
	public constructor(public client: Mattis) {}

	public load(): void {
		fs.readdir("./dist/events", async (err, events) => {
			this.client.logger.info(`Loading ${events.length} events...`);
			for (const file of events) {
				const event = await import(`./events/${file}`);
				if (event === undefined)
					throw new Error(`File ${file} is not a valid event file.`);
				if (err)
					throw new Error(`Error while compiling events: ${err}`);
				const [eventName] = file.split(".");
				this.client.logger.info(
					`Events on listener ${eventName.toString()} has been added.`
				);
				this.client.addListener(eventName, (...args) =>
					event.execute(...args)
				);

				/*this.client.logger.info(
					`Events on listener ${event.name.toString()} has been added.`
				);
				this.client.addListener(event.name, (...args) =>
					event.execute(...args)
				);*/
			}
		});
	}
}
