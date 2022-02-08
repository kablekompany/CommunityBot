const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
	async ({ ctx, msg, args }) => {
		const guild = args[0] ? ctx.bot.guilds.resolve(args[0]) : msg.guild;
		const { username } = ctx.bot.users.resolve(msg.guild.ownerId);
		let invs;
		try {
			invs = `[\`Link\`](${(await guild.fetchInvites()).first().url})`;
		} catch (_) {
			invs = '[`Link`](https://discord.gg/memers)';
		}
		const vLevel = guild.verificationLevel.toLowerCase();
		const upper = vLevel.charAt(0).toUpperCase() + vLevel.substring(1);
		return {
			fields: [
				{
					name: 'Server',
					value:
						`**Name**: ${guild.name}\n` +
						`**ID**: \`${guild.id}\`\n` +
						`**Verification**: ${upper}`,
					inline: true
				},
				{
					name: 'Owner',
					value:
						`**Tag**: \`${username}\` [<@${guild.ownerId}>]\n` +
						`**ID**: \`${guild.ownerId}\``,
					inline: true
				},
				{
					name: 'Stats',
					value:
						`**Channels**: ${guild.channels.cache.size}\n` +
						`**Emotes**: ${guild.emojis.cache.size}\n` +
						`**Roles**: ${guild.roles.cache.size}\n` +
						`**Members**: ${guild.memberCount.toLocaleString()}`,
					inline: true
				},
				{
					name: 'Misc',
					value: `**Invites**: ${invs}`,
					inline: true
				}
			],
			author: {
				name: 'Server Info'
			},
			thumbnail: {
				url: guild.iconURL({ dynamic: true, size: 1024 })
			},
			footer: {
				text: `Created on: ${ctx.utils.parseDate(guild.createdAt)}`
			},
			color: ctx.utils.randomColour()
		};
	},
	{
		name: 'serverinfo',
		aliases: ['si'],
		usage: 'View server information',
		adminOnly: true
	}
);
