import { Collection } from 'discord.js';
import { promises as fs } from 'fs';
import { Mattis } from './Mattis';
import { resolve } from 'path';
import { IAction, ICategoryMeta } from '../typings';

export class ActionsManager extends Collection<string, IAction> {
	public isReady = false;
	public readonly categories: Collection<string, /*ICategoryMeta*/ any> =
		new Collection();
	public constructor(public Mattis: Mattis, public path: string) {
		super();
	}

	public load(): void {
		this.Mattis.Logger.info(`[ActionManager] Start registering actions.`);
		fs.readdir(resolve(this.path))
			.then(async (categories) => {
				this.Mattis.Logger.info(
					`[ActionManager] Found ${categories.length} categories, registering...`
				);
				for (const category of categories) {
					const meta = (await import(
						resolve(this.path, category, 'category.meta.js')
					)) as ICategoryMeta;

					this.categories.set(category, meta);
					this.Mattis.Logger.info(
						`[ActionManager] Registering ${category} category...`
					);

					await fs
						.readdir(resolve(this.path, category))
						.then((files) => files.filter((f) => f !== 'category.meta.js'))
						.then(async (files) => {
							let disabledCount = 0;

							this.Mattis.Logger.info(
								`[ActionManager] Found ${files.length} of actions in ${category}, loading...`
							);

							for (const file of files) {
								try {
									const path = resolve(this.path, category, file);

									const action = await this.Mattis.utils.import<IAction>(
										path,
										this.Mattis,
										{ category, path }
									);
									if (action === undefined)
										throw new Error(
											`[ActionManager] File ${file} is not a valid action file.`
										);

									action.meta = Object.assign(action.meta, {
										path,
										category,
									});

									this.set(action.id, action);

									this.Mattis.Logger.info(
										`[ActionManager] Action ${action.meta.name} from ${category} category is now loaded.`
									);
								} catch (err) {
									this.Mattis.Logger.error(
										`[ActionManager] Error occured while loading ${file}: ${
											(err as Error).message
										}`
									);
								}
							}
							return { disabledCount, files };
						})
						.then((data) => {
							this.categories.set(
								category,
								Object.assign(meta, {
									cmds: this.filter(({ meta }) => meta.category === category),
								})
							);
							this.Mattis.Logger.info(
								`[ActionManager] Done loading ${data.files.length} actions in ${category} category.`
							);
							if (data.disabledCount !== 0)
								this.Mattis.Logger.info(
									`[ActionManager] ${data.disabledCount} out of ${data.files.length} actions in ${category} category is disabled.`
								);
						})
						.catch((err) => this.Mattis.Logger.error('CMD_LOADER_ERR:', err))
						.finally(() =>
							this.Mattis.Logger.info(
								`[ActionManager] Done registering ${category} category.`
							)
						);
				}
			})
			.catch((err) => this.Mattis.Logger.error('ACT_LOADER_ERR:', err))
			.finally(() => {
				this.Mattis.Logger.info(
					'[ActionManager] All actions has been registered.'
				);
				this.isReady = true;
			});
	}
}
