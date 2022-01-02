const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    const categories = [
      ctx.config.dmc.tradeCategory,
      ctx.config.dmc.memerCategory,
    ];

    if (
      ctx.config.dmc.allStaffRoles.some((r) => msg.member._roles.includes(r))
    ) {
      return null;
    }

    if (!categories.includes(msg.channel.parentId)) {
      return null;
    }

    if (!msg.content.match(/(dm me|pm me|msg me)/gi)) {
      return null;
    }

    await msg.delete();
    await ctx.utils.timeoutMember(
      msg,
      '"DM me/msg me" in trade/dank memer channels.',
    );

    const drama = ctx.bot.channels.resolve(ctx.config.dmc.dramaWatcher);
    const modlog = ctx.bot.channels.resolve(ctx.config.dmc.modlog);
    const message = await drama.send({
      embeds: [
        {
          title: 'DM Message Deleted',
          description: `**${msg.author.tag}** (\`${
            msg.author.id
          }\`) said:\n${ctx.utils.codeblock(msg.content)}\nChannel: <#${
            msg.channel.id
          }>\nUser has been timed out for **20 minutes**.`,
          timestamp: new Date(),
          color: 15705088,
        },
      ],
    });
    await modlog.send({
      embeds: [
        {
          title: 'timeout | 20 minutes',
          description:
            `**Offender:** ${msg.author.tag} <@${msg.author.id}>\n` +
            '**Reason:** Caught by "dm me" censor in trade/bot channels\n' +
            '**Responsible moderator:** Community Bot#6333',
          color: 15960130,
          timestamp: new Date(),
          footer: { text: `ID: ${msg.author.id}` },
        },
      ],
    });

    const messageLink = `https://discord.com/channels/${msg.guild.id}/${drama.id}/${message.id}`;
    await ctx.db.users.addInfraction(msg.author.id, messageLink);
    return null;
  },
  {
    name: 'censors',
    allowDM: false,
    allowBot: false,
  },
);
