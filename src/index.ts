import "dotenv/config";
import { ShardingManager } from "discord.js";
import { resolve } from "path";
import { discordToken } from "./config";

const manager = new ShardingManager(resolve(__dirname, "bot.js"), {
	totalShards: "auto",
	respawn: true,
	token: discordToken,
	mode: "worker",
});

manager
	.on("shardCreate", (shard) => {
		console.log(`[ShardManager] Shard #${shard.id} Spawned.`);
		shard
			.on("disconnect", () => {
				console.log("SHARD DISCONNECTED");
			})
			.on("reconnecting", () => {
				console.log("SHARD RECONNECT");
			});
		if (manager.shards.size === manager.totalShards)
			console.log("[ShardManager] All shards spawned successfully.");
	})
	.spawn()
	.catch((e) => console.log("SHARD_SPAWN_ERROR: ", e));
