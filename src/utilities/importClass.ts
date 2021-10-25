import { resolve, parse } from 'path';

export const importClass = async function <T>(
	path: string,
	...args: any[]
): Promise<T | undefined> {
	const file = await import(resolve(path)).then((m) => m[parse(path).name]);
	return file ? new file(...args) : undefined;
};
