/* eslint-disable indent */
const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require('../../models/Command/CommandModel');
const { relativeTime } = require('../../utils/misc');

const submissionQueue = '914382828186255391';
module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const [arg] = args;

    if (arg?.toLowerCase() === 'top') {
      const leaderboards = await ctx.db.submissions.getLeaderboards();
      const data = [];

      for await (const db of leaderboards) {
        const user = await ctx.bot.users.fetch(db.userID).catch(() => null);
        data.push(
          db.userID
            ? `Submission **#${db._id}** (created ${relativeTime(
                db.createdAt,
              )}) by ${
                user.tag
              } has:\n- <:upvote:919609115129569350>: **${db.upvotes.length.toLocaleString()}** and <:downvote:919609066442063952>: **${db.downvotes.length.toLocaleString()}**`
            : '',
        );
      }

      return {
        title: 'Top Upvoted Submissions',
        description: data.join('\n\n'),
        color: ctx.utils.randomColour(),
      };
    }

    if (arg?.toLowerCase() === 'check') {
      const userID = args[1];
      const exists = await ctx.db.submissions.exists(userID);

      if (!exists) {
        return "Couldn't find a submission for this user ID";
      }
      const db = await ctx.db.submissions.collection.findOne({ userID });
      const user = await ctx.bot.users.fetch(userID);
      return {
        title: `Submission for ${user.tag} | #${db._id}`,
        description: `<:upvote:919609115129569350>: **${db.upvotes.length.toLocaleString()}**\n<:downvote:919609066442063952>: **${db.downvotes.length.toLocaleString()}**`,
        image: {
          url: db.link,
        },
      };
    }

    if (arg?.toLowerCase() === 'fix') {
      const potentialMessage = args[1];
      const channel = await msg.guild.channels.cache.get(submissionQueue); // submission queue
      const message = await channel.messages.fetch(potentialMessage, {
        force: true,
      });

      if (!message) {
        return `I couldn't find this message in ${channel.toString()}`;
      }

      if (msg.author.id !== ctx.bot.user.id) {
        return "Invalid message, this isn't a submission";
      }

      const components = [
        new MessageActionRow({
          components: [
            new MessageButton({
              emoji: {
                id: '919416789266497596',
                name: 'approve',
              },
              style: 'SECONDARY',
              customId: `approve_${msg.author.id}`,
            }),
            new MessageButton({
              emoji: {
                id: '919416821428412517',
                name: 'deny',
              },
              style: 'SECONDARY',
              customId: `deny_${msg.author.id}`,
            }),
          ],
        }),
      ];

      await message.edit({ components });
      const messageLink = `https://discord.com/channels/${msg.guild.id}/${channel.id}/${message.id}`;
      return {
        description: `Buttons re-added! See the message with **[this link](${messageLink})** to approve it.`,
      };
    }
    const db = await ctx.db.submissions.get(+arg);

    if (db.link === '') {
      return "Invalid submission ID maybe? Couldn't find this in the database";
    }

    const user = await ctx.bot.users.fetch(db.userID);
    return {
      title: `Submission #${db._id} by ${user.tag}`,
      description: `<:upvote:919609115129569350>: **${db.upvotes.length.toLocaleString()}**\n<:downvote:919609066442063952>: **${db.downvotes.length.toLocaleString()}**`,
      image: {
        url: db.link,
      },
    };
  },
  {
    name: 'submissions',
    usage: 'submissions <submission #>',
    aliases: ['submission', 's'],
    modOnly: true,
    argReq: true,
    responses: {
      noArg:
        "I'm gonna need a submission ID to check, `d!s check <userID>` or pass `top` to get top voted posts",
    },
  },
);
