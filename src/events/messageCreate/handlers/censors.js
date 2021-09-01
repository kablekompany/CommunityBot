const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    const modRoles = [ctx.config.dmc.trialMod, ctx.config.dmc.modRole];
    const categories = [
      ctx.config.dmc.tradeCategory,
      ctx.config.dmc.memerCategory,
    ];

    if (modRoles.some((r) => msg.member._roles.includes(r))) {
      return null;
    }

    if (!categories.includes(msg.channel.parentId)) {
      return null;
    }

    if (!msg.content.match(/(dm me|pm me|msg me)/gi)) {
      return null;
    }

    msg.delete();
    ctx.utils.muteMember(msg);

    const drama = ctx.bot.channels.resolve(ctx.config.dmc.dramaWatcher);
    const modlog = ctx.bot.channels.resolve(ctx.config.dmc.modlog);
    drama.send({
      embeds: [
        {
          title: 'DM Message Deleted',
          description: `**${msg.author.tag}** (\`${
            msg.author.id
          }\`) said:\n${ctx.utils.codeblock(msg.content)}\nChannel: <#${
            msg.channel.id
          }>\nUser has been muted for **20 minutes**.`,
          timestamp: new Date(),
          color: 15705088,
        },
      ],
    });
    return modlog.send({
      embeds: [
        {
          title: 'mute | 20 minutes',
          description:
            `**Offender:** ${msg.author.username}#${msg.author.discriminator}<@${msg.author.id}>\n` +
            '**Reason:** Caught by "dm me" censor in trade/bot channels\n' +
            '**Responsible moderator:** Community Bot#6333',
          color: 15960130,
          timestamp: new Date(),
          footer: { text: msg.author.id },
        },
      ],
    });
  },
  {
    name: 'censors',
    allowDM: false,
    allowBot: false,
  },
);
