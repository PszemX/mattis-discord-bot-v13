import { Collection } from 'discord.js';
import { promises as fs } from 'fs';
import { Mattis } from './Mattis';
import { resolve } from 'path';
import { IAction, ICategoryMeta } from '../typings';
import { readdirRecSync } from '../utilities/reddirRecSync';

export class ActionsManager extends Collection<string, IAction> {
	public constructor(public Mattis: Mattis, public path: string) {
		super();
	}

	public async load(): Promise<void> {
		this.Mattis.Logger.info(`[ActionManager] Start registering actions.`);
		const actionPaths = readdirRecSync(this.path);
		this.Mattis.Logger.info(
			`[ActionManager] Found ${actionPaths.length} actions, registering...`
		);
		for (const actionPath of actionPaths) {
			const actionFile: string = resolve(this.path, actionPath);
			try {
				const action = await this.Mattis.utils.import<IAction>(actionFile, []);
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
}
