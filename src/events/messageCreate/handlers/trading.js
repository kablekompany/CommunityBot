const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
	async ({ ctx, msg }) => {
		if (!ctx.config.dmc.tradeCategory.includes(msg.channel.parentId)) {
			return null;
		}

		const filter = (channel, word) => {
			const content = msg.content.toLowerCase();
			const badMsg = msg.channel.id === channel && content.includes(word);
			const safe = ['buy', 'sell'].every((w) => content.includes(w));
			if (badMsg && !safe) {
				return true;
			}
			return false;
		};

		const deleteMsg = () => setTimeout(() => msg.delete(), 2000);
		const reply = async (content) => {
			const message = await msg.reply(content);
			return setTimeout(() => message.delete(), 7500);
		};

		const tradeLogs = ctx.bot.channels.resolve(ctx.config.dmc.tradeLogs);
		const logMessage = (reason) =>
			tradeLogs.send({
				embeds: [
					{
						title: `Reason: ${reason}`,
						author: {
							name: 'Trade Message Deleted',
							icon_url: msg.author.avatarURL({
								dynamic: true,
								size: 1024
							})
						},
						description: `**${msg.author.tag}** (\`${
							msg.author.id
						}\`) said:\n${ctx.utils.codeblock(
							msg.content
						)}\nChannel: <#${msg.channel.id}>`,
						timestamp: new Date(),
						color: 15705088
					}
				]
			});

		if (filter(ctx.config.dmc.tradeBuying, 'sell')) {
			deleteMsg();
			await reply(
				`This channel is for buying stuff, go to <#${ctx.config.dmc.tradeSelling}> to sell.`
			);
			return logMessage('selling in buying-ads');
		}

		if (filter(ctx.config.dmc.tradeSelling, 'buy')) {
			deleteMsg();
			await reply(
				`This channel is for selling stuff, go to <#${ctx.config.dmc.tradeBuying}> to buy.`
			);
			return logMessage('buying in selling-ads');
		}

		const lineCheck = msg.content.split('\n').length >= 15;
		if (lineCheck) {
			deleteMsg();
			await reply(
				'Your trade-ad was 15 lines or longer, please post a shorter ad.'
			);
			return logMessage('trade ad was 15 lines or longer');
		}
		return null;
	},
	{
		name: 'trading',
		allowDM: false,
		allowBot: false
	}
);
