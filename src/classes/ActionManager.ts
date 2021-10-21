import { Mattis } from './Mattis';

export class ActionManager {
	public constructor(public client: Mattis);

	public load(): void {
		this.client.logger.debug('Action loading');
	}
}
