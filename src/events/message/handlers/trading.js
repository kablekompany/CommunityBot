const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    if (!ctx.config.dmc.tradeCategory.includes(msg.channel.parentID)) {
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

    const reply = (content) =>
      msg.reply(content).then((m) => m.delete({ timeout: 7500 }));

    if (filter(ctx.config.dmc.tradeBuying, 'sell', true)) {
      msg.delete();
      reply(
        `this channel is for buying stuff, go to <#${ctx.config.dmc.tradeSelling}> to sell.`,
      );
      return logMessage('selling in buying-ads');
    }

    if (filter(ctx.config.dmc.tradeSelling, 'buy', true)) {
      msg.delete();
      reply(
        `this channel is for selling stuff, go to <#${ctx.config.dmc.tradeBuying}> to buy.`,
      );
      return logMessage('buying in selling-ads');
    }

    if (
      msg.channel.id === ctx.config.dmc.tradeItems &&
      msg.content.split(' ').some((w) => w.match(/\b(coin|coins)\b/g))
    ) {
      msg.delete();
      reply('this channel is only for item-item trades!');
      return logMessage('trading coins in item-ads');
    }
    return null;
  },
  {
    name: 'trading',
    allowDM: false,
    allowBot: false,
  },
);
