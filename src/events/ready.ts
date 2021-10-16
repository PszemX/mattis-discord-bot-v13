export class ReadyEvent {
	public readonly name: string = 'ready';

	public async execute(): Promise<void> {
		console.log("MATTIS JEST GOTOWY!!!!!!");
	}
}
