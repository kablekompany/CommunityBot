const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, args }) => {
    const [id] = args;

    if (['highest', 'top'].includes(id?.toLowerCase())) {
      const topModlogs = await ctx.db.users.getTopInfractions();
      const sorted = topModlogs.sort(
        (a, b) => b.infractionCount - a.infractionCount,
      );
      const data = [];

      for await (const user of sorted) {
        const userInfo = await ctx.bot.users.fetch(user._id);
        data.push(
          `- **${user.infractionCount.toLocaleString()}** for ${
            userInfo.tag
          } (\`${user._id}\`)`,
        );
      }

      return {
        title: 'Highest Infraction Counts',
        description: data.join('\n'),
        color: ctx.utils.randomColour(),
      };
    }
    const db = await ctx.db.users.get(id);
    const user = await ctx.bot.users.fetch(id);
    const infractions = [];

    if (!db.infractions.length) {
      return "I couldn't find that user in the database :(";
    }

    db.infractions.map((i) => infractions.push(`- **[Link](${i})**`));
    return {
      title: `User Modlogs for ${user.tag}`,
      description: `Total: **${db.infractionCount.toLocaleString()}**\n\nLast 5 Infractions:\n${infractions.join(
        '\n',
      )}`,
    };
  },
  {
    name: 'logs',
    usage: 'logs <id>',
    aliases: ['logs'],
    modOnly: true,
    argReq: true,
    responses: {
      noArg:
        "I'm gonna need a user ID to check, or pass `top`/`highest` to see the users with the highest infractions.",
    },
  },
);
