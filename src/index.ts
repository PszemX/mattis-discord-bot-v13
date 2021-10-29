import 'dotenv/config';
import figlet from 'figlet';
import { ShardingManager } from 'discord.js';
import { resolve } from 'path';
import { createLogger } from './structures/Logger';
import { discordToken } from './config';

const log = createLogger('shardingManager');

console.log(
	figlet.textSync('M.A.T.T.I.S', {
		font: 'Big',
		horizontalLayout: 'fitted',
		width: 100,
		whitespaceBreak: true,
	})
);

const manager = new ShardingManager(resolve(__dirname, 'bot.js'), {
	totalShards: 'auto',
	respawn: true,
	token: discordToken,
	mode: 'worker',
});

manager
	.on('shardCreate', (shard) => {
		log.info(`[ShardManager] Shard #${shard.id} Spawned.`);
		shard
			.on('disconnect', () => {
				log.warn('SHARD DISCONNECTED');
			})
			.on('reconnecting', () => {
				log.info('SHARD RECONNECT');
			});
		if (manager.shards.size === manager.totalShards)
			log.info('[ShardManager] All shards spawned successfully.');
	})
	.spawn()
	.catch((e) => log.error('SHARD_SPAWN_ERROR: ', e));
