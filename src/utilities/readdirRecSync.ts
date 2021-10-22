import fs from 'fs';

const _readdirRecSync = function (basePath: string, path: string, paths: any) {
	fs.readdirSync(basePath + path).forEach((localPath: string) => {
		if (fs.statSync(basePath + path + '/' + localPath).isDirectory())
			_readdirRecSync(basePath, path + '/' + localPath, paths);
		else paths.push((path + '/' + localPath).slice(1));
	});
};

export const readdirRecSync = function (path: string) {
	let paths: any = [];
	_readdirRecSync(path, '', paths);
	return paths;
};
