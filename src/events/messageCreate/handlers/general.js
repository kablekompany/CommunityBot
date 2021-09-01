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

    if (msg.content.match(/(dm me|pm me|msg me)/gi)) {
      const modRoles = [ctx.config.dmc.trialMod, ctx.config.dmc.modRole];
      if (modRoles.some((r) => msg.member._roles.includes(r))) {
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
              `**Reason:** Caught by "dm me" censor in <#${ctx.config.dmc.general}>\n` +
              '**Responsible moderator:** Community Bot#6333',
            color: 15960130,
            timestamp: new Date(),
            footer: { text: msg.author.id },
          },
        ],
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
