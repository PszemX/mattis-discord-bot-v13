import { Mattis } from "./classes/Mattis";
import { clientOptions } from "./config";

const mattis = new Mattis(clientOptions);

process.on("exit", (code) => {
	console.log(`NodeJS process exited with code ${code}`);
});
process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT_EXCEPTION:", err);
	console.log("Uncaught Exception detected. Restarting...");
	process.exit(1);
});
process.on("warning", (warning) => {
	console.log("PROCESS_WARNING: ", warning);
});

mattis.build().catch((e) => console.log("PROMISE_ERR:", e));
