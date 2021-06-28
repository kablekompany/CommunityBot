const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    if (!ctx.config.dmc.tradeCategory.includes(msg.channel.parentID)) {
      return null;
    }

    const filter = (channel, word) =>
      msg.channel.id === channel && msg.content.toLowerCase().includes(word);

    const dramaWatcher = ctx.bot.channels.resolve(ctx.config.dmc.dramaWatcher);
    const logMessage = (reason) =>
      dramaWatcher.send({
        embed: {
          title: `Reason: ${reason}`,
          author: {
            name: 'Trade Message Deleted',
            icon_url: msg.author.avatarURL({ dynamic: true, size: 1024 }),
          },
          description: `**${msg.author.tag}** (\`${
            msg.author.id
          }\`) said:\n${ctx.utils.codeblock(msg.content)}\nChannel: <#${
            msg.channel.id
          }>`,
          timestamp: new Date(),
          color: 15705088,
        },
      });

    if (filter(ctx.config.dmc.tradeItems, 'coin')) {
      msg.delete();
      return logMessage('trading coins in item-ads');
    }

    if (filter(ctx.config.dmc.tradeBuying, 'sell')) {
      msg.delete();
      return logMessage('selling in buying-ads');
    }

    if (filter(ctx.config.dmc.tradeSelling, 'buy')) {
      msg.delete();
      return logMessage('buying in selling-ads');
    }
    return null;
  },
  {
    name: 'trading',
    allowDM: false,
    allowBot: false,
  },
);
