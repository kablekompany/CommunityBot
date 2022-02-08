const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
	async ({ ctx, msg, args }) => {
		let { guild } = msg;
		let pageNum = args[0] || 1;
		if (ctx.config.owners.includes(msg.author.id) && args[0]) {
			guild = ctx.bot.guilds.resolve(args[1] ? args[0] : guild.id);
			pageNum = args[1] || args[0];
		}
		const emotes = guild.emojis.cache.map(
			(e) =>
				`<${e.animated ? 'a' : ''}:${e.name}:${e.id}> \`:${e.name}:\``
		);

		const pages = ctx.utils.paginate(emotes);
		if (pageNum > pages.length) {
			return `Page **${pageNum}** doesn't exist you dingus, there are only ${pages.length} pages`;
		}

		if (msg.content.includes('--all')) {
			const color = ctx.utils.randomColour();
			await Promise.all(
				pages.map((page, index, arr) =>
					msg.channel.send({
						embeds: [
							{
								description: page,
								color,
								title: `Server emotes - ${msg.guild.name}`,
								footer: {
									text: `Page ${index + 1} of ${arr.length}`
								}
							}
						]
					})
				)
			);
		} else {
			return {
				description: pages[pageNum - 1],
				title: `Server emotes - ${msg.guild.name}`,
				footer: {
					text: `Page ${pageNum} of ${pages.length}`
				}
			};
		}
		return null;
	},
	{
		name: 'listemotes',
		aliases: ['le'],
		adminOnly: true,
		usage: 'View server emotes'
	}
);
