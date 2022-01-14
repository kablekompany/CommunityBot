/* eslint-disable no-confusing-arrow */
const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    // eslint-disable-next-line prefer-const
    let [user, time] = args;
    const reason = args.slice(2).join(' ') || 'N/A';
    const member =
      msg.guild.members.cache.get(user) ||
      msg.guild.members.cache.find((m) =>
        m.tag === user || m.username === user || msg.mentions.users.size > 0
          ? m.id === msg.mentions.users.first().id
          : false
      ); // move this to the command class or smth

    if (!member) {
      return "Not a valid user ID (or this user isn't cached).";
    }

    if (!time) {
      time = '15m';
    }

    let milliseconds;
    try {
      milliseconds = ctx.utils.validateTime(time);
    } catch (err) {
      await msg.reply({
        embeds: [
          {
            description: 'This seems like an invalid time, try again maybe?'
          }
        ]
      });
      return null;
    }

    try {
      await member.timeout(milliseconds, reason);
    } catch (err) {
      await msg.reply({
        embeds: [
          {
            description: `I was unable to timeout this member.\n\nError: ${err.message}`,
            color: 0xd3403d // red
          }
        ]
      });
      return null;
    }

    const endTime = ctx.utils.relativeTime(Date.now() + milliseconds);
    member
      .send({
        embeds: [
          {
            title: `You've been timed out in ${msg.guild.name}`,
            description: `Reason: ${reason}\n\nTimeout ends **${endTime}**`,
            color: 0xed7438 // orange
          }
        ]
      })
      .catch(() => null);

    const modlog = ctx.bot.channels.resolve(ctx.config.dmc.modlog);
    const moderator = {
      id: msg.author.id,
      tag: msg.author.tag
    };
    const caseNumber = await ctx.db.logs.add(
      member.id,
      reason,
      moderator,
      time
    );
    modlog.send({
      embeds: [
        {
          title: `timeout | case #${caseNumber} | ${ctx.utils.parseTime(
            milliseconds / 1000
          )}`,
          description:
            `**Offender:** ${member.user.tag} <@${member.id}>\n` +
            `**Reason:** ${reason}\n` +
            `**Responsible moderator:** ${msg.author.tag}`,
          color: 15960130,
          timestamp: new Date(),
          footer: { text: `ID: ${member.id}` }
        }
      ]
    });

    const m = await msg.reply({
      embeds: [
        {
          title: 'Timeout Successful',
          description: `**${member.user.tag}**'s timeout ends ${endTime}`,
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
    name: 'mute',
    usage: 'mute <user> <time> <reason>',
    aliases: ['m', 'timeout'],
    modOnly: true,
    argReq: true,
    responses: {
      noArg:
        'Who are we timing out today? Syntax: `mute <user> <time> <reason>`\n\nExample: `m 266432078222983169 1h5m spamming chat & arguing with mods`'
    }
  }
);
