import { parseCommandParameters } from '../utilities/parseCommandParameters';
import { readdirRecSync } from '../utilities/reddirRecSync';
import { IAction, ICommand, IEventData } from '../typings';
import { Collection } from 'discord.js';
import { Mattis } from './Mattis';
import { resolve } from 'path';

export class ActionsManager extends Collection<string, IAction | ICommand> {
	public constructor(public Mattis: Mattis, public path: string) {
		super();
	}

	public async loadActions(): Promise<void> {
		this.Mattis.Logger.info(`[ActionManager] Start registering actions.`);
		const actionPaths = readdirRecSync(this.path);
		this.Mattis.Logger.info(
			`[ActionManager] Found ${actionPaths.length} actions, registering...`
		);
		for (const actionPath of actionPaths) {
			const actionFile: string = resolve(this.path, actionPath);
			try {
				const action = await this.Mattis.utils.import<IAction | ICommand>(
					actionFile,
					[]
				);
				if (action === undefined)
					throw new Error(`File ${actionPath} is not a valid action file.`);

				this.set(action.name, action);

				this.Mattis.Logger.info(
					`[ActionManager] Action ${actionPath} is now loaded.`
				);
			} catch (err) {
				this.Mattis.Logger.error(
					`[ActionManager] Error occured while loading ${actionPath}: ${
						(err as Error).message
					}`
				);
			}
		}
		this.Mattis.Logger.info(`[ActionManager] Done registering actions.`);
	}

	public async loadCommands(): Promise<void> {
		console.log('Ładuję komendy!');
	}

	public async handleCommand(EventData: IEventData): Promise<void> {
		const commandContent = EventData.args.content.slice(
			EventData.guildCache.settings.prefix.length
		);
		const commandContentSplitted = commandContent.split(' ');
		let branch = EventData.guildCache.commandsTree;
		let commandRawParametersSplitted = [];
		for (let i = 0; i < commandContentSplitted.length; ++i) {
			const branchName = commandContentSplitted[i];
			if (branch.b && branch.b[branchName]) {
				branch = branch.b[branchName];
			} else {
				commandRawParametersSplitted = commandContentSplitted.slice(i);
				break;
			}
		}
		const command = branch.c;
		if (command) {
			const commandParameters = await parseCommandParameters(
				EventData,
				command,
				commandRawParametersSplitted
			);
			try {
				await command.execute(EventData, commandParameters).then(() => {
					this.Mattis.Logger.debug(
						`Komenda ${command.name} na serwerze ${EventData.args.guildId}`
					);
				});
			} catch (err) {
				this.Mattis.Logger.error(
					`Error occured while executing ${command.name}: ${
						(err as Error).message
					}`
				);
			}
		}
	}
}
