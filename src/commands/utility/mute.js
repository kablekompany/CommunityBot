const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    // eslint-disable-next-line prefer-const
    let [user, time] = args;
    let member = Command.resolveMember(msg, user);
    let reason = args.slice(2).join(' ') || 'N/A';

    if (!member) {
      return "Not a valid user ID (or this user isn't cached).";
    }

    if (!time) {
      time = '15m';
    }

    // mute mods that try to mute other mods for 30s because why not
    if (
      member._roles.includes(ctx.config.dmc.modRole) &&
      !msg.member._roles.includes(ctx.config.dmc.adminRole)
    ) {
      member = msg.member;
      time = '30s';
      reason = '30s timeout for attempting to mute a fellow mod 🥲';
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
            description: 'I was unable to timeout this member.',
            color: 0xd3403d // red
          }
        ]
      });
      return console.error(err.stack);
    }

    const endTime = ctx.utils.formatTime(Date.now() + milliseconds);
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
