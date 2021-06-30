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

    if (filter(ctx.config.dmc.tradeBuying, 'sell')) {
      msg.delete();
      reply(
        `this channel is for buying stuff, go to <#${ctx.config.dmc.tradeSelling}> to sell.`,
      );
      return logMessage('selling in buying-ads');
    }

    if (filter(ctx.config.dmc.tradeSelling, 'buy')) {
      msg.delete();
      reply(
        `this channel is for selling stuff, go to <#${ctx.config.dmc.tradeBuying}> to buy.`,
      );
      return logMessage('buying in selling-ads');
    }

    const lineCheck = msg.content.split('\n').length >= 15;
    if (lineCheck) {
      msg.delete();
      reply('your trade-ad was 15 lines or longer, please post a shorter ad.');
      return logMessage('trade ad was 15 lines or longer');
    }
    return null;
  },
  {
    name: 'trading',
    allowDM: false,
    allowBot: false,
  },
);
