const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, args }) => {
    const [id] = args;
    const user = await ctx.db.users.get(id);
    const infractions = [];

    if (!user.infractions.length) {
      return "I couldn't find that user in the database :(";
    }

    await Promise.all(
      user.infractions.map((i, index) =>
        infractions.push(`${index + 1} - **[Link](${i})**`),
      ),
    );

    return {
      title: 'User Modlogs',
      description: `Total: **${
        user.infractionCount
      }**\n\nLast 5 Infractions:\n${infractions.join('\n')}`,
    };
  },
  {
    name: 'modlogs',
    usage: 'modlogs <id>',
    aliases: ['ml'],
    modOnly: true,
    argReq: true,
    responses: {
      noArg: "I'm gonna need a user ID to check",
    },
  },
);
