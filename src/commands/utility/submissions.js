/* eslint-disable indent */
const Command = require('../../models/Command/CommandModel');
const { relativeTime } = require('../../utils/misc');

module.exports = new Command(
  async ({ ctx, args }) => {
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
