const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, args }) => {
    const [id] = args;

    if (id?.toLowerCase() === 'highest') {
      const topModlogs = await ctx.db.users.getTopInfractions();
      const data = [];

      for await (const user of topModlogs) {
        const userInfo = await ctx.bot.users.fetch(user._id);
        data.push(
          `- **${user.infractionCount.toLocaleString()}** for ${
            userInfo.tag
          } (\`${user._id}\`)`,
        );
      }

      return {
        title: 'Highest Infraction Counts',
        description: data.reverse().join('\n'),
        color: ctx.utils.randomColour(),
      };
    }
    const db = await ctx.db.users.get(id);
    const user = await ctx.bot.users.fetch(id);
    const infractions = [];

    if (!db.infractions.length) {
      return "I couldn't find that user in the database :(";
    }

    Promise.all(
      db.infractions.map((i) => infractions.push(`- **[Link](${i})**`)),
    );

    return {
      title: `User Modlogs for ${user.tag}`,
      description: `Total: **${db.infractionCount.toLocaleString()}**\n\nLast 5 Infractions:\n${infractions.join(
        '\n',
      )}`,
    };
  },
  {
    name: 'modlogs',
    usage: 'modlogs <id>',
    aliases: ['modlog', 'ml'],
    modOnly: true,
    argReq: true,
    responses: {
      noArg: "I'm gonna need a user ID to check",
    },
  },
);
