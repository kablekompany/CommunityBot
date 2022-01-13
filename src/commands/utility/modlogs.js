const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, args }) => {
    const [id] = args;
    const modlogs = await ctx.db.logs.fetchAll(id);
    const user = await ctx.bot.users.fetch(id);
    const embed = {
      title: 'User Modlogs',
      author: {
        name: user.tag,
        icon_url: user.avatarURL({ dynamic: true }),
      },
      fields: [],
      footer: {},
    };

    if (!modlogs.length) {
      return "I couldn't find that user in the database :(";
    }

    for await (const entry of modlogs) {
      const d = new Date(entry.date);
      const date = d.toLocaleDateString('de-DE').replaceAll('.', '-');
      embed.fields.push({
        name: `#${entry.case} | ${entry.type} | ${date}`,
        value: `Responsible Moderator: ${entry.moderator.tag}\nReason: ${
          entry.reason
        }\n${entry.duration ? `Duration: ${entry.duration}` : ''}`,
        inline: true,
      });
    }

    if (embed.fields.length > 10) {
      embed.footer.text = `Showing 10 of ${embed.fields.length}`;
      embed.fields = embed.fields.splice(0, 10); // paginate later instead of splicing
    }
    return embed;
  },
  {
    name: 'modlogs',
    aliases: ['ml', 'modlog', 'l', 'logs'],
    usage: 'modlogs <id>',
    modOnly: true,
    argReq: true,
    responses: {
      noArg: "I'm gonna need a **user ID** to check.",
    },
  },
);
