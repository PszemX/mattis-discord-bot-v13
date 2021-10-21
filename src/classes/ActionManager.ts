import { promises as fs } from 'fs';
import { resolve, parse } from 'path';
import { Mattis } from './Mattis';

export class ActionManager {
	public constructor(public client: Mattis, public path: string) {}

	public load(): void {
		fs.readdir(resolve(this.path))
			.then(async (actions) => {
				this.client.logger.info(`Loading ${actions.length} categories...`);
				for (const file of actions) {
					const action = await this.import<any>(
						resolve(this.path, file),
						this.client
					);
					if (action === undefined)
						throw new Error(`File ${file} is not a valid action file.`);
					this.client.logger.info(`Action '${action.name.toString()}' loaded.`);
					this.client.on(action.name, (...args) => action.execute(...args));
				}
			})
			.catch((err) => this.client.logger.error('ACIONS_LOADER_ERR:', err))
			.finally(() => this.client.logger.info('Done loading actions.'));
	}

	private async import<T>(
		path: string,
		...args: any[]
	): Promise<T | undefined> {
		const file = await import(resolve(path)).then((m) => m[parse(path).name]);
		return file ? new file(...args) : undefined;
	}
}
