const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
	async ({ ctx, msg }) => {
		return; // TODO
		const guildIDs = [ctx.config.dmo.guildID, ctx.config.dmc.guildID];
		if (msg.guild && !guildIDs.includes(msg.guild.id)) {
			return null;
		}

		const domainRegex = /(?:[\w-]+\.)+[\w-]+/gi;
		const domainRegexTest = domainRegex.exec(msg.content);

		if (!domainRegexTest) {
			return null;
		}
		const { isScam, verifiedPhish, classification } =
			await ctx.phisherman.checkDomain(domainRegexTest[0]);

		if (!isScam) {
			return null;
		}

		try {
			await ctx.phisherman.reportCaughtPhish(
				domainRegexTest[0],
				ctx.secrets.phishermanApiKey,
				msg.guild.id
			);
		} catch (err) {
			console.error(err.stack);
		}
		const banAndPostToLogs = async (modlogChannelID) => {
			const red = 0xf83656;
			const reason = `Sent phishing link in ${msg.channel.toString()}`;
			const moderator = {
				id: ctx.bot.user.id,
				tag: ctx.bot.user.tag
			};
			const [yesTick, noTick] = [
				'<:yesTick:931242491007606795>',
				'<:noTick:931242523685449818>'
			];
			let dmSent = false;

			// dm banned user
			try {
				await msg.member.send({
					embeds: [
						{
							title: `You have been banned in ${msg.guild.name}`,
							description: `You have been banned for posting phishing/scam links in #${msg.channel.name}. If you didn't do this, please change your password and enable 2FA on your Discord account.\n\nYou can appeal the ban **[here](https://dankmemer.lol/appeals)** after your account is secured.`,
							timestamp: new Date(),
							color: red
						}
					]
				});
				dmSent = true;
			} catch (err) {
				console.error(err.message);
			}

			await msg.member.ban({ days: 7, reason });
			const caseNumber = await ctx.db.logs.add(
				msg.author.id,
				reason,
				moderator,
				null,
				'ban'
			);

			const embeds = [
				{
					title: `ban | case #${caseNumber}`,
					description:
						`**Offender:** ${msg.author.tag} <@${msg.author.id}>\n` +
						`**Reason:** ${reason}\n` +
						`**Responsible moderator:** ${ctx.bot.user.tag}`,
					color: red,
					timestamp: new Date(),
					footer: { text: `ID: ${msg.author.id}` }
				}
			];

			const automodLogs = ctx.bot.channels.resolve(
				msg.guild.id === ctx.config.dmo.guildID
					? ctx.config.dmo.automodLogs
					: ctx.config.dmc.automodLogs
			);

			await automodLogs.send({
				content: msg.author.toString(),
				embeds: [
					{
						title: 'Phishing Link Detected',
						fields: [
							{
								name: 'Information:',
								value: `**${msg.author.tag}** (\`${
									msg.author.id
								}\`) said:\n${ctx.utils.codeblock(
									msg.content
								)}\nChannel: <#${
									msg.channel.id
								}>\nUser has been banned.\nDM Sent: ${
									dmSent === true ? yesTick : noTick
								}`,
								inline: false
							},
							{
								name: 'Domain caught',
								value: domainRegexTest[0]
							},
							{
								name: 'API info for this domain',
								value: `Classified as: ${classification}\nVerified phishing link: ${verifiedPhish}`
							}
						],
						timestamp: new Date(),
						color: red
					}
				]
			});
			const modlog = ctx.bot.channels.resolve(modlogChannelID);
			return modlog.send({ embeds });
		};

		return banAndPostToLogs(
			msg.guild.id === ctx.config.dmc.guildID
				? ctx.config.dmc.modlog
				: ctx.config.dmo.modlog
		);
	},
	{
		name: 'phisherman',
		allowDM: false,
		allowBot: false
	}
);
