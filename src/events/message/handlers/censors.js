const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    const categories = [
      ctx.config.dmc.tradeCategory,
      ctx.config.dmc.memerCategory,
    ];

    if (msg.member._roles.includes(ctx.config.dmc.modRole)) {
      return null;
    }

    if (!categories.includes(msg.channel.parentID)) {
      return null;
    }

    if (!msg.content.match(/(dm me|pm me|msg me)/gi)) {
      return null;
    }

    msg.delete();
    ctx.utils.muteMember(msg);

    const channel = ctx.bot.channels.resolve(ctx.config.dmc.dramaWatcher);
    return channel.send({
      embed: {
        title: 'DM Message Deleted',
        description: `**${msg.author.tag}** (\`${
          msg.author.id
        }\`) said:\n${ctx.utils.codeblock(msg.content)}\nChannel: <#${
          msg.channel.id
        }>\nUser has been muted for **20 minutes**.`,
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
