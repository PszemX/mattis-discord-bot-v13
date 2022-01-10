// const colors = require("/modules/colors.json");
import * as colors from '../utilities/colors.json';
import latinize from 'latinize';
import axios from 'axios';
import countryCodes from '../utilities/country_codes.json';
import continentsIds from '../utilities/continents_ids.json';
import lang from '../utilities/lang';
import { MessageEmbed } from 'discord.js';

module.exports = {
	id: 'covid',
	event: 'command',
	tags: {
		funny: true,
	},
	syntaxes: [[{ type: 'text', name: 'country' }]],
	func: async function (data: any, parameters: any) {
		let town = '';
		let place = '';
		let country = parameters.country;
		let parametersLowerCase = country.toLowerCase();
		let targetCountryCode = countryCodes.find((countryCode) => {
			if (
				lang(`countries.${countryCode}`, data).toLowerCase() ==
				parametersLowerCase
			)
				return countryCode;
			if (
				lang(`countries.${countryCode}`, data, '', 'eng').toLowerCase() ==
				parametersLowerCase
			)
				return countryCode;
		});
		if (!targetCountryCode) return data.args.message.reply('country not found');
		let targetCountryName = lang(`countries.${targetCountryCode}`, data);
		let targetCountryNameEncoded = encodeURIComponent(
			lang(`countries.${targetCountryCode}`, data, '', 'eng')
		);
		let yesterdayTests = (
			await axios.get(
				`https://disease.sh/v3/covid-19/countries/${targetCountryNameEncoded}?yesterday=true`
			)
		).data.tests;
		axios
			.get(
				`https://disease.sh/v3/covid-19/countries/${targetCountryNameEncoded}`
			)
			.then((response: any) => {
				let covid = response.data;
				let cases = covid.cases;
				let todayCases = covid.todayCases;
				let deaths = covid.deaths;
				let todayDeaths = covid.todayDeaths;
				let country = covid.country;
				let continent = '';
				let critical = covid.critical;

				for (let i = 0; i < continentsIds.length; ++i) {
					if (lang(`continents.${continentsIds[i]}`, data) == covid.continent) {
						continent = lang(`continents.${continentsIds[i]}`, data);
						break;
					}
				}

				let population = covid.population;
				let smiertelnosc = ((deaths / cases) * 100).toFixed(2);
				let recovered = covid.recovered;
				let todayRecovered = covid.todayRecovered;
				let wyzdrowienia = ((recovered / cases) * 100).toFixed(2);
				let tests = covid.tests;
				let criticalPercent = ((critical / cases) * 100).toFixed(2);
				let testPercent = ((tests / population) * 100).toFixed(2);
				let todayTests = tests - yesterdayTests;
				const embed = {
					title: `Coronavirus COVID-19 - ${targetCountryName}`,
					description: lang('actions.covid.description', data),
					color: colors.blue,
					thumbnail: {
						url: covid.countryInfo.flag,
					},
					fields: [
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
						{
							name: lang('actions.covid.population', data),
							value: population
								.toString()
								.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ','),
							inline: true,
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
						{
							name: lang('actions.covid.confirmed', data),
							value: cases
								.toString()
								.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ','),
							inline: true,
						},
						{
							name: lang('actions.covid.deaths', data),
							value:
								deaths
									.toString()
									.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
								` (**${smiertelnosc}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.recovered', data),
							value:
								recovered
									.toString()
									.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
								`\n(**${wyzdrowienia}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.todayConfirmed', data),
							value:
								'+' +
								todayCases
									.toString()
									.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
								`\n(**${((todayCases / cases) * 100).toFixed(2)}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.todayDeaths', data),
							value:
								'+' +
								todayDeaths
									.toString()
									.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
								` (**${((todayDeaths / cases) * 100).toFixed(2)}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.todayTests', data),
							value:
								'+' +
								todayTests
									.toString()
									.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
								`\n(**${((todayTests / population) * 100).toFixed(2)}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.seriousCritical', data),
							value:
								critical
									.toString()
									.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
								` (**${criticalPercent}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.active', data),
							value:
								(cases - (recovered + deaths))
									.toString()
									.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
								`\n(**${(
									((cases - (recovered + deaths)) / cases) *
									100
								).toFixed(2)}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.totalTests', data),
							value:
								tests
									.toString()
									.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') +
								`\n(**${testPercent}%**)`,
							inline: true,
						},
					],
				};
				data.args.channel.send({
					embeds: [embed],
				});
			});
	},
};
