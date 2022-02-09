const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors');
const CommandOptionType = require('../utils/CommandOptionType');

const domainRegex = /(?:[\w-]+\.)+[\w-]+/gi;

module.exports = {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
	 * @param {import('../models/Bot/BotModel')} ctx
	 */
	async execute(interaction, ctx) {
		const potentialLink = interaction.options.getString('link');
		await interaction.deferReply({ ephemeral: true });

		const domainRegexTest = domainRegex.exec(
			potentialLink.replace('www.', '')
		);

		if (!domainRegexTest) {
			return interaction.editReply(
				"This doesn't seem like a valid URL/domain"
			);
		}

		const basicCheck = await ctx.phisherman.checkDomain(domainRegexTest[0]);
		const advancedCheck = await ctx.phisherman.getDomainInfo(
			domainRegexTest[0]
		);

		let advancedCheckEmbed = new MessageEmbed()
			.setDescription('No extra info is available for this domain.')
			.setColor(colors.invisible);

		if (
			advancedCheck &&
			!['safe', 'unknown'].includes(advancedCheck.classification)
		) {
			advancedCheckEmbed = new MessageEmbed()
				.setTitle(`Domain Info | ${domainRegexTest[0]}`)
				.setDescription(
					`Caught \`${advancedCheck.phishCaught.toLocaleString()}\` times`
				)
				.setTimestamp(new Date())
				.setColor(colors.invisible)
				.addField('Status', advancedCheck.status, true)
				.addField(
					'Verified Phish',
					advancedCheck.verifiedPhish ? 'Yes' : 'No',
					true
				)
				.addField(
					'Classification',
					ctx.utils.capitalize(advancedCheck.classification),
					true
				)
				.addField(
					'Date Added',
					ctx.utils.formatTime(advancedCheck.created, 'f'),
					true
				)
				.addField(
					'First Seen',
					ctx.utils.formatTime(advancedCheck.firstSeen, 'f'),
					true
				)
				.addField(
					'Last Seen',
					ctx.utils.formatTime(advancedCheck.lastSeen, 'f'),
					true
				)
				.addField('Targeted Brand', advancedCheck.targetedBrand, true);
		}

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Basic Check Results')
					.addField('Classification', basicCheck.classification, true)
					.addField(
						'Verified phishing link',
						basicCheck.verifiedPhish === true ? 'Yes' : 'No',
						true
					)
					.setColor(colors.invisible),
				advancedCheckEmbed
			]
		});
	},
	name: 'checkdomain',
	description:
		'Check a link against the phisherman.gg API for phishing links.',
	default_permission: false,
	options: [
		{
			name: 'link',
			type: CommandOptionType.String,
			description: "The link you'd like to check",
			required: true
		}
	]
};
