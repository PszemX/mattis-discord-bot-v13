import fs from 'fs';

const _readdirRecSync = function (basePath: any, path: any, paths: any) {
	fs.readdirSync(basePath + path).forEach((localPath: any) => {
		if (fs.statSync(`${basePath + path}/${localPath}`).isDirectory()) {
			_readdirRecSync(basePath, `${path}/${localPath}`, paths);
		} else paths.push(`${path}/${localPath}`.slice(1));
	});
};

export const readdirRecSync = function (path: any) {
	const paths: any = [];
	_readdirRecSync(path, '', paths);
	return paths;
};
