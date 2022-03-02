/* eslint-disable indent */
import DiscordJS, { Presence } from 'discord.js';
import { BaseEvent } from '../classes/BaseEvent';

export class ReadyEvent extends BaseEvent {
	public constructor(mattis: BaseEvent['mattis']) {
		super(mattis, 'ready');
	}

	public async execute(): Promise<void> {
		if (this.mattis.application?.owner) {
			this.mattis.config.owners.push(this.mattis.application.owner.id);
		}
		// await this.client.spotify.renew();
		await this.doPresence();
		const totalMembers = await this.formatString('{userCount}');
		const totalServers = await this.formatString('{serverCount}');
		const totalTextChannels = await this.formatString('{textChannelsCount}');
		const totalVoiceChannels = await this.formatString('{playingCount}');
		console.log('╠═══════════════════════╗');
		console.log('╠   Mattis is running!  ╬');
		console.log('╠═══════════════════════╬');
		console.log(`╠ Members: ${totalMembers}`);
		console.log(`╠ Guilds: ${totalServers}`);
		console.log(`╠ Text Channels: ${totalTextChannels}`);
		console.log(`╠ VoiceChannels: ${totalVoiceChannels}`);
		console.log(`╠ Discord.js: ${DiscordJS.version}`);
		console.log(`╠ Node.js: ${process.version}`);
		console.log('╠═══════════════════════╝');
	}

	private async formatString(text: string): Promise<string> {
		let newText = text;

		if (text.includes('{userCount}')) {
			const users = await this.mattis.utils.getUserCount();

			newText = newText.replace(/{userCount}/g, users.toString());
		}
		if (text.includes('{textChannelsCount}')) {
			const textChannels = await this.mattis.utils.getChannelCount(true);

			newText = newText.replace(
				/{textChannelsCount}/g,
				textChannels.toString()
			);
		}
		if (text.includes('{serverCount}')) {
			const guilds = await this.mattis.utils.getGuildCount();

			newText = newText.replace(/{serverCount}/g, guilds.toString());
		}
		if (text.includes('{playingCount}')) {
			const playings = await this.mattis.utils.getPlayingCount();

			newText = newText.replace(/{playingCount}/g, playings.toString());
		}

		return newText
			.replace(/{prefix}/g, this.mattis.config.defaultPrefix)
			.replace(/{username}/g, this.mattis.user?.username as string);
	}

	private async setPresence(random: boolean): Promise<Presence> {
		const activityNumber = random
			? Math.floor(
					Math.random() * this.mattis.config.presenceData.activities.length
			  )
			: 0;
		const statusNumber = random
			? Math.floor(
					Math.random() * this.mattis.config.presenceData.status.length
			  )
			: 0;
		const activity = (
			await Promise.all(
				this.mattis.config.presenceData.activities.map(async (a) =>
					Object.assign(a, { name: await this.formatString(a.name) })
				)
			)
		)[activityNumber];

		return this.mattis.user!.setPresence({
			activities: (activity as { name: string } | undefined) ? [activity] : [],
			status: this.mattis.config.presenceData.status[statusNumber],
		});
	}

	private async doPresence(): Promise<Presence | undefined> {
		try {
			return this.setPresence(false);
		} catch (e) {
			if ((e as Error).message !== 'Shards are still being spawned.') {
				this.mattis.Logger.error(String(e));
			}
			return undefined;
		} finally {
			setInterval(
				() => this.setPresence(true),
				this.mattis.config.presenceData.interval
			);
		}
	}
}
