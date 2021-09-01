const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const user = Command.resolveUser(ctx, args.shift());
    if (!user) {
      return "This doesn't seem like a real user?";
    }

    try {
      await user.send({
        embeds: [
          {
            author: {
              name: `You've received a message from a server admin in ${msg.guild.name}`,
              icon_url: msg.guild.iconURL({ dynamic: true, size: 1024 }),
            },
            description: args.join(' '),
            timestamp: new Date(),
          },
        ],
      });
      await msg.react('📨');
    } catch (err) {
      await msg.react('❌');
      return err.message;
    }
    return null;
  },
  {
    name: 'dm',
    usage: 'dms the user stuff, <command>',
    adminOnly: true,
    argReq: true,
    minArgs: 2,
    responses: {
      noArg: 'Who do I dm? What do i dm them?',
      lowArg: 'What do I dm them?',
    },
  },
);
