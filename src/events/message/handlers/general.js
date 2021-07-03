const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    if (msg.channel.id !== ctx.config.dmc.general) {
      return null;
    }

    const filter =
      msg.content.toLowerCase().startsWith('pls') &&
      !msg.member._roles.includes(ctx.config.dmc.modRole);

    if (filter) {
      msg.delete();
    }

    if (msg.content.match(/\b(dm me|pm me|msg me)\b/gi)) {
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
    }
    return null;
  },
  {
    name: 'general',
    allowDM: false,
    allowBot: false,
  },
);
