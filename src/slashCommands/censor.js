/* eslint-disable default-case */
const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors');
const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
	async execute(interaction, ctx) {
		const action = interaction.options.getString('action', true);
		const word = interaction.options.getString('word');

		const { censors } = await ctx.db.automod.get(interaction.guild.id);

		switch (action) {
			case 'add':
				if (!word || word.length < 3) {
					return interaction.reply({
						embeds: [
							new MessageEmbed()
								.setDescription('Censors need 3+ characters.')
								.setColor(colors.invisible)
						]
					});
				}
				if (censors.includes(word)) {
					return interaction.reply({
						embeds: [
							new MessageEmbed()
								.setDescription('This censor already exists.')
								.setColor(colors.invisible)
						]
					});
				}
				await ctx.db.automod.genericAdd(
					interaction.guild.id,
					word,
					'censor'
				);

				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle('Censor added')
							.setDescription(
								`Successfully added \`${word}\` as a censor.`
							)
							.setColor(colors.invisible)
					]
				});
			case 'remove':
				if (!word || !censors.includes(word)) {
					return interaction.reply({
						embeds: [
							new MessageEmbed()
								.setDescription("This isn't a censor.")
								.setColor(colors.invisible)
						]
					});
				}
				await ctx.db.automod.genericRemove(
					interaction.guild.id,
					word,
					'censor'
				);

				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle('Censor removed')
							.setDescription(
								`Successfully removed \`${word}\` as a censor.`
							)
							.setColor(colors.invisible)
					]
				});
			case 'list':
				if (!censors || !censors.length) {
					return interaction.reply({
						embeds: [
							new MessageEmbed()
								.setDescription('No censors in this server.')
								.setColor(colors.invisible)
						]
					});
				}

				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle('All Censors')
							.setDescription(
								censors
									.map((p, id) => `\`${id + 1}.\` ${p}`)
									.join('\n')
							)
							.setColor(colors.invisible)
					]
				});
		}
	},
	name: 'censor',
	description: 'Add, remove or list current censors',
	default_permission: false,
	options: [
		{
			name: 'action',
			type: CommandOptionType.String,
			description: 'Censor action',
			choices: [
				{
					name: 'Add',
					value: 'add'
				},
				{
					name: 'Remove',
					value: 'remove'
				},
				{
					name: 'List',
					value: 'list'
				}
			],
			required: true
		},
		{
			name: 'word',
			type: CommandOptionType.String,
			description: 'Word to add, remove or list',
			required: false
		}
	]
};
