/* eslint-disable array-callback-return */
import { ColorResolvable, MessageEmbed } from 'discord.js';
import latinize from 'latinize';
import axios from 'axios';
import continentsIds from '../utilities/continents_ids.json';
import countryCodes from '../utilities/country_codes.json';
import { BaseCommand } from '../classes/BaseCommand';
import * as colors from '../utilities/colors.json';
import { IEventData } from '../typings';
import lang from '../utilities/lang';

export class CovidCommand extends BaseCommand {
	public constructor() {
		super('covid', 'command', {
			syntaxes: [[{ type: 'text', name: 'country' }]],
			aliases: ['covid'],
			cooldown: 1000,
			disable: false,
			devOnly: false,
			description: 'Show the current SARS-CoV-2 statistics.',
			category: 'general',
			name: 'ping',
			usage: '{prefix}covid {country}',
			// slash: SlashOption,
			// contextChat: string,
			// contextUser: string,
		});
	}

	public async execute(EventData: IEventData, parameters: any) {
		const country = latinize(parameters.country).toLowerCase();
		const targetCountryCode = countryCodes.find((countryCode) => {
			if (
				lang(`countries.${countryCode}`, EventData).toLowerCase() == country
			) {
				return countryCode;
			}
			if (
				lang(`countries.${countryCode}`, EventData, '', 'eng').toLowerCase() ==
				country
			) {
				return countryCode;
			}
		});
		if (!targetCountryCode) {
			return EventData.args.reply(
				lang('actions.covid.countryNotFound', EventData)
			);
		}
		const targetCountryName = lang(`countries.${targetCountryCode}`, EventData);
		const targetCountryNameEncoded = encodeURIComponent(
			lang(`countries.${targetCountryCode}`, EventData, '', 'eng')
		);
		const yesterdayTests = (
			await axios.get(
				`https://disease.sh/v3/covid-19/countries/${targetCountryNameEncoded}?yesterday=true`
			)
		).data.tests;
		axios
			.get(
				`https://disease.sh/v3/covid-19/countries/${targetCountryNameEncoded}`
			)
			.then(async (response) => {
				const covid = response.data;
				const allCases = covid.cases;
				const { todayCases } = covid;
				const allDeaths = covid.deaths;
				const { todayDeaths } = covid;
				// const country = covid.country;
				const { critical } = covid;
				for (let i = 0; i < continentsIds.length; ++i) {
					if (
						lang(`continents.${continentsIds[i]}`, EventData) == covid.continent
					) {
						const continent = lang(`continents.${continentsIds[i]}`, EventData);
						break;
					}
				}
				const { population } = covid;
				const deathRate = ((allDeaths / allCases) * 100).toFixed(2);
				const allRecovered = covid.recovered;
				// const todayRecovered = covid.todayRecovered;
				const wyzdrowienia = ((allRecovered / allCases) * 100).toFixed(2);
				const allTests = covid.tests;
				const criticalPercent = ((critical / allCases) * 100).toFixed(2);
				const testPercentage = ((allTests / population) * 100).toFixed(2);
				const todayTests = allTests - yesterdayTests;

				const covidEmbed = new MessageEmbed()
					.setTitle(`Coronavirus COVID-19 - ${targetCountryName}`)
					.setDescription(lang('actions.covid.description', EventData))
					.setColor(<ColorResolvable>colors.blue)
					.setThumbnail(covid.countryInfo.flag)
					.addFields([
						{
							name: '\u200b',
							value: '\u200b',
							inline: true,
						},
						{
							name: lang('actions.covid.population', EventData),
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
							name: lang('actions.covid.confirmed', EventData),
							value: allCases
								.toString()
								.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ','),
							inline: true,
						},
						{
							name: lang('actions.covid.deaths', EventData),
							value: `${allDeaths
								.toString()
								.replace(
									/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
									','
								)} (**${deathRate}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.recovered', EventData),
							value: `${allRecovered
								.toString()
								.replace(
									/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
									','
								)}\n(**${wyzdrowienia}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.todayConfirmed', EventData),
							value: `+${todayCases
								.toString()
								.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}\n(**${(
								(todayCases / allCases) *
								100
							).toFixed(2)}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.todayDeaths', EventData),
							value: `+${todayDeaths
								.toString()
								.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')} (**${(
								(todayDeaths / allCases) *
								100
							).toFixed(2)}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.todayTests', EventData),
							value: `+${todayTests
								.toString()
								.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}\n(**${(
								(todayTests / population) *
								100
							).toFixed(2)}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.seriousCritical', EventData),
							value: `${critical
								.toString()
								.replace(
									/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
									','
								)} (**${criticalPercent}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.active', EventData),
							value: `${(allCases - (allRecovered + allDeaths))
								.toString()
								.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}\n(**${(
								((allCases - (allRecovered + allDeaths)) / allCases) *
								100
							).toFixed(2)}%**)`,
							inline: true,
						},
						{
							name: lang('actions.covid.totalTests', EventData),
							value: `${allTests
								.toString()
								.replace(
									/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
									','
								)}\n(**${testPercentage}%**)`,
							inline: true,
						},
					]);
				await EventData.args.channel.send({ embeds: [covidEmbed] });
			});
	}
}
