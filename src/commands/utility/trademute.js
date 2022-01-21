/* eslint-disable no-confusing-arrow */
const Command = require('../../models/Command/CommandModel');

const flagHelp = [
  '`-tm <user> ch` - to mute a user for posting trade ads in the wrong channel. (like buying ads in <#831384047711158282>)',
  '`-tm <user> p` - to mute a user posting ads asking for offers, or without a price',
  '`-tm <user> w` - to mute a user for posting huge/wallspam ads',
  '`-tm <user> a` - to mute a user for auctioning/bidding *(for 3 hours)*',
  '`-tm <user> s` - to mute a user for troll/shitposting ads',
  '`-tm <user> f` - to mute a user for excessively formatting in ads`'
];
const startOfReason =
  'If you wish to continue trading here, please refrain from';
const reasons = {
  ch: 'If you wish to continue trading here, please refer to server rule 5 and the respective pins and make sure to read the description in each trade channel to make sure you are using the channel correctly.',
  p: `${startOfReason} posting ads without specifying a price, asking for offers, or requesting price negotiations **without** specifying a price.`,
  w: `${startOfReason} posting ads above 15 lines in any channel.`,
  a: `${startOfReason} participating or starting auctions/bidding, which is against our trade guidelines.`,
  s: `${startOfReason} posting troll/shitposting ads and posting irrelevant messages in the channels.`,
  f: `${startOfReason} formatting in ads excessively. This includes excessive code blocks, spoilers, strikethroughs, bold, italic and special fonts`
};

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const [user, flag] = args;
    const reason = reasons[flag];
    const member =
      msg.guild.members.cache.get(user) ||
      msg.guild.members.cache.find((m) =>
        m.tag === user || m.username === user || msg.mentions.users.size > 0
          ? m.id === msg.mentions.users.first().id
          : false
      ); // move this to the command class or smth

    if (user === 'help' || !reason) {
      return {
        title: 'Trade Mute Flags',
        description: `\`-tm <user> <flag>\` to mute a user for breaking trade rules.\n(Note: Mute durations are preset to 3h for auctioning and 1h for all others)\n\n${flagHelp
          .map((a) => `> ${a}`)
          .join('\n')}`
      };
    }

    if (!member) {
      return "Not a valid user ID (or this user isn't cached).";
    }

    const time = flag === 'a' ? '3h' : '1h';
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
    name: 'trademute',
    usage: 'trademute <user> <flag>',
    aliases: ['tm'],
    modOnly: true,
    argReq: true,
    responses: {
      noArg:
        'Pass `help` as the first argument to see available flags for trade mutes.'
    }
  }
);
