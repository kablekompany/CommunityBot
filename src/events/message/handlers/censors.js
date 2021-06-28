const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    const categories = [
      ctx.config.dmc.tradeCategory,
      ctx.config.dmc.memerCategory,
    ];

    if (!categories.includes(msg.channel.parentID)) {
      return null;
    }

    if (!msg.content.toLowerCase().includes('dm')) {
      return null;
    }

    msg.delete();

    const channel = ctx.bot.channels.resolve(ctx.config.dmc.dramaWatcher);
    return channel.send({
      embed: {
        title: 'DM Message Deleted',
        description: `**${msg.author.tag}** (\`${
          msg.author.id
        }\`) said:\n${ctx.utils.codeblock(msg.content)}\nChannel: <#${
          msg.channel.id
        }>`,
        timestamp: new Date(),
        color: 15705088,
      },
    });
  },
  {
    name: 'censors',
    allowDM: false,
    allowBot: false,
  },
);
