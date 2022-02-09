const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors');
const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
	 * @param {import('../models/Bot/BotModel')} ctx
	 */
	async execute(interaction, ctx) {
		const member = interaction.options.getMember('member', true);
		const reason = interaction.options.getString('reason', true);
		const time = interaction.options.getString('time', true);
		let milliseconds;

		try {
			milliseconds = ctx.utils.validateTime(time);
		} catch (err) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setDescription(
							'This seems like an invalid time, try again maybe?'
						)
						.setColor(colors.invisible)
				]
			});
		}

		try {
			await member.timeout(milliseconds, reason);
		} catch (err) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setDescription(
							`I was unable to timeout this member.\n\nError: ${err.message}`
						)
						.setColor(colors.red)
				],
				ephemeral: true
			});
		}

		const endTime = ctx.utils.formatTime(Date.now() + milliseconds);
		await member
			.send({
				embeds: [
					new MessageEmbed()
						.setTitle(
							`You've been timed out in ${interaction.guild.name}`
						)
						.setDescription(
							`\`Reason\`: ${reason}\n\nTimeout ends ${endTime}`
						)
						.setColor(colors.invisible)
				]
			})
			.catch(() => null);

		const modlog = ctx.bot.channels.resolve(ctx.config.dmc.channels.modLog);
		const moderator = {
			id: interaction.user.id,
			tag: interaction.user.tag
		};
		const caseNumber = await ctx.db.logs.add(
			member.id,
			reason,
			moderator,
			time
		);
		modlog.send({
			embeds: [
				new MessageEmbed()
					.setTitle(
						`timeout | case #${caseNumber} | ${ctx.utils.parseTime(
							milliseconds / 1000
						)}`
					)
					.setDescription(
						`\`Offender:\` ${member.user.tag} <@${member.id}>\n` +
							`\`Reason:\` ${reason}\n` +
							`\`Responsible moderator:\` ${moderator.tag}`
					)
					.setColor(colors.orange)
					.setTimestamp(new Date())
					.setFooter({ text: `ID: ${member.id}` })
			]
		});

		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('Timeout Successful')
					.setDescription(
						`\`${member.user.tag}\`'s timeout ends ${endTime}`
					)
					.setColor(colors.green)
			],
			ephemeral: true
		});
	},
	name: 'timeout',
	default_permission: false,
	description: 'Timeout a user for a specified duration with a reason.',
	options: [
		{
			name: 'member',
			type: CommandOptionType.User,
			description: 'The member you would like to timeout',
			required: true
		},
		{
			name: 'reason',
			type: CommandOptionType.String,
			description: 'The reason for the timeout',
			required: true
		},
		{
			name: 'time',
			type: CommandOptionType.String,
			description: 'The duration of the timeout',
			required: true
		}
	]
};
