import fs from 'fs';
import { readdirRecSync } from './reddirRecSync';
import * as config from '../config';
const translations = readdirRecSync(__dirname + '/../translations').reduce(
	(translations: any, filepath: any) => {
		let translation = require('../translations/' + filepath);

		let id = filepath.split('/').pop().slice(0, -3);
		translations[id] = translation;
		return translations;
	},
	{}
);

const lang: any = (path: any, data: any, payload?: any, lan?: any) => {
	let language = data.guildCache.settings.language || config.baseLanguage;
	if (lan) language = lan;
	let translation = translations;
	for (let relativePath of [language, ...path.split('.')]) {
		translation = translation[relativePath];
		if (!translation) {
			console.error(
				`Error: Lang error, missing path. Language: "${language}", path: "${path}"`
			);
			if (language == config.baseLanguage) return path;
			return lang(
				path,
				{
					...data,
					language: config.baseLanguage,
				},
				payload
			);
		}
	}
	switch (typeof translation) {
		case 'string':
			return translation;
		case 'function':
			return translation(data, payload);
		default:
			console.error(
				`Error: Lang error, wrong path. Language: "${language}", path: "${path}"`
			);
			return path;
	}
};

export default lang;
