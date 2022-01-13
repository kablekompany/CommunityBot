/* eslint-disable no-confusing-arrow */
const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const [user] = args;
    const reason = args.slice(1).join(' ') || 'N/A';
    const member =
      msg.guild.members.cache.get(user) ||
      msg.guild.members.cache.find((m) =>
        m.tag === user || m.username === user || msg.mentions.users.size > 0
          ? m.id === msg.mentions.users.first().id
          : false
      );

    if (!member) {
      return "Not a valid user ID (or this user isn't cached).";
    }

    try {
      await member.timeout(null, reason);
    } catch (err) {
      await msg.reply({
        embeds: [
          {
            description: `I was unable to remove this member's timeout.\n\nError: ${err.message}`,
            color: 0xd3403d // red
          }
        ]
      });
      return null;
    }

    const modlog = ctx.bot.channels.resolve(ctx.config.dmc.modlog);
    modlog.send({
      embeds: [
        {
          title: 'removed timeout',
          description:
            `**Offender:** ${member.user.tag} <@${member.id}>\n` +
            `**Reason:** ${reason}\n` +
            `**Responsible moderator:** ${msg.author.tag}`,
          color: 0x42f4a7, // green
          timestamp: new Date(),
          footer: { text: `ID: ${member.id}` }
        }
      ]
    });

    const moderator = {
      id: msg.author.id,
      tag: msg.author.tag
    };
    await ctx.db.logs.add(member.id, reason, moderator, null, 'unmute');
    const m = await msg.reply({
      embeds: [
        {
          title: 'Timeout Reset',
          description: `**${member.user.tag}**'s timeout was removed.`,
          color: 0x89ff7a // green
        }
      ]
    });
    setTimeout(async () => {
      await m.delete();
      await msg.delete();
    }, 1000 * 5);
  },
  {
    name: 'unmute',
    usage: 'unmute <user> <reason>',
    aliases: ['um'],
    modOnly: true,
    argReq: true,
    responses: {
      noArg: '`unmute <user> <reason>`'
    }
  }
);
