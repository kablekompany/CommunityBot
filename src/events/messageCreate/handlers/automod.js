const { MessageEmbed } = require('discord.js');
const MessageHandler = require('../../../models/Handlers/MessageHandler');
const colors = require('../../../utils/colors');

function testCensor(string, censors) {
	const re = new RegExp(censors.join('|'), 'gi');
	const match = re.exec(string);

	if (!match) {
		return false;
	}
	return match[0];
}

const [yesTick, noTick] = [
	'<:yesTick:931242491007606795>',
	'<:noTick:931242523685449818>'
];

module.exports = new MessageHandler(
	async ({ ctx, msg }) => {
		if (msg.guild && msg.guild.id !== ctx.config.dmc.guildID) {
			return;
		}

		if (
			Object.values(ctx.config.dmc.roles).some((r) =>
				msg.member._roles.includes(r)
			)
		) {
			return;
		}

		const { censors } = await ctx.db.automod.get(msg.guild.id);
		if (!censors.length) {
			return;
		}

		const censorTest = testCensor(msg.content, censors);
		if (!censorTest) {
			return;
		}

		await msg.delete();

		const reason = `Automatic action carried out for using blacklisted word(s): \`${censorTest}\``;

		let dmSent = false;
		await msg.member.timeout(1_200_000);

		const caseNumber = await ctx.db.logs.add(
			msg.author.id,
			reason,
			{
				tag: ctx.bot.user.tag,
				id: ctx.bot.user.id
			},
			'20m'
		);
		try {
			const endTime = ctx.utils.formatTime(Date.now() + 1_200_000);
			await msg.member.send({
				embeds: [
					new MessageEmbed()
						.setTitle(
							`You have been timed out in ${msg.guild.name}`
						)
						.setDescription(
							`\`Reason\`: ${reason}\n\nTimeout ends ${endTime}`
						)
						.setColor(colors.invisible)
				]
			});
			dmSent = true;
		} catch (err) {
			console.error(err.message);
		}

		const automodLogs = ctx.bot.channels.resolve(
			ctx.config.dmc.channels.autoModLogs
		);
		const modlog = ctx.bot.channels.resolve(ctx.config.dmc.channels.modLog);
		await automodLogs.send({
			content: msg.author.toString(),
			embeds: [
				new MessageEmbed()
					.setTitle('Censor Automod')
					.setTimestamp(new Date())
					.setColor(colors.orange)
					.addField(
						'Information',
						`\`User:\` ${msg.author.tag} (${msg.author.id})\n` +
							`\`Channel:\` <#${msg.channel.id}>\n` +
							'`Action:` 20 minutes timeout\n' +
							`\`DM Sent\`: ${
								dmSent === true ? yesTick : noTick
							}`,
						false
					)
					.addField('Said', ctx.utils.codeblock(msg.content), false)
					.addField('Caught by', censorTest, false)
			]
		});
		await modlog.send({
			embeds: [
				new MessageEmbed()
					.setTitle(`timeout | case #${caseNumber} | 20 minutes`)
					.setDescription(
						`\`Offender:\` ${msg.author.tag} <@${msg.author.id}>\n` +
							`\`Reason:\` ${reason}\n` +
							'`Responsible moderator:` Community Bot#6333'
					)
					.setColor(colors.orange)
					.setTimestamp(new Date())
					.setFooter({ text: `ID: ${msg.author.id}` })
			]
		});
	},
	{
		name: 'automod',
		allowDM: false,
		allowBot: false
	}
);
