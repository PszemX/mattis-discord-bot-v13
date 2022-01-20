import { GuildMember } from 'discord.js';
import latinize from 'latinize';

const naturalRegex = /^\+?[0-9]+$/;
const integerRegex = /^[\+\-]?[0-9]+$/;
const urlRegex =
	/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
const memberIdRegex = /^\<\@\!?[0-9]+\>$/;
const channelIdRegex = /^\<\#[0-9]+\>$/;
const digitsRegex = /[0-9]+/;
const lettersRegex = /[a-zA-Z]+/;

const converters: any = {
	word: {
		test: (text: string) => true,
		convert: (text: string, data: any) => text,
	},
	wordNotNumber: {
		test: (text: any) => isNaN(text),
		convert: (text: string, data: any) => text,
	},
	wordOnlyDigits: {
		test: (text: string) => digitsRegex.test(text),
		convert: (text: string, data: any) => text,
	},
	wordOnlyLetters: {
		test: (text: string) => lettersRegex.test(latinize(text)),
		convert: (text: string, data: any) => text,
	},
	natural: {
		test: (text: string) => naturalRegex.test(text),
		convert: (text: string, data: any) => Number(text),
	},
	discordId: {
		test: (text: string) => digitsRegex.test(text),
		convert: (text: string, data: any) => text,
	},
	integer: {
		test: (text: string) => integerRegex.test(text),
		convert: (text: string, data: any) => Number(text),
	},
	number: {
		test: (text: any) => !isNaN(text),
		convert: (text: string, data: any) => Number(text),
	},
	member: {
		test: (text: string) => memberIdRegex.test(text),
		convert: async (text: any, data: any) =>
			data.guild.members
				.fetch(text.match(digitsRegex)[0])
				.then((member: GuildMember) => member)
				.catch((error: any) => null),
	},
	channel: {
		test: (text: string) => channelIdRegex.test(text),
		convert: async (text: any, data: any) =>
			data.guild.channels.cache.get(text.match(digitsRegex)[0]) || null,
	},
	url: {
		test: (text: string) => urlRegex.test(text),
		convert: (text: string, data: any) => text,
	},
};

const parseWords = async (
	parameters: any,
	syntax: any,
	words: any,
	data: any
): Promise<any> => {
	if (syntax.length == 0 && words.length == 0) return parameters;
	if (words.length < syntax.length || (syntax.length == 0 && words.length > 0))
		return false;
	let newSyntax = syntax.slice(1);
	if (syntax[0].type == 'text') {
		for (let i = 1; i <= words.length - newSyntax.length; ++i) {
			let text = words.slice(0, i).join(' ');
			let newWords = words.slice(i);
			let newParameters = {
				[syntax[0].name]: text,
				...parameters,
				_size: parameters._size + 1,
			};
			let returnParameters: any = await parseWords(
				newParameters,
				newSyntax,
				newWords,
				data
			);
			if (returnParameters) return returnParameters;
		}
	} else if (converters[syntax[0].type].test(words[0], data))
		return await parseWords(
			{
				[syntax[0].name]: await (converters as any)[syntax[0].type].convert(
					words[0],
					data
				),
				...parameters,
				_size: parameters._size + 1,
			},
			newSyntax,
			words.slice(1),
			data
		);
	return false;
};

const parseCommandParameters = async (
	data: any,
	command: any,
	rawParametersSplitted: any
) => {
	for (let syntax of command.syntaxes) {
		let parse = await parseWords(
			{ _size: 0 },
			syntax,
			rawParametersSplitted,
			data
		);
		if (parse) return parse;
	}
	throw 'invalid syntax';
};

export { parseCommandParameters };
