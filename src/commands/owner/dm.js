const OwnerCommand = require('../../models/Command/OwnerCommand');

module.exports = new OwnerCommand(
  async ({ ctx, msg, args }) => {
    const user = OwnerCommand.resolveUser(ctx, args.shift());
    if (!user) {
      return "This doesn't seem like a real user?";
    }

    try {
      await user.send(args.join(' '));
      await msg.react('📨');
    } catch (err) {
      return err.message;
    }
    return null;
  },
  {
    name: 'dm',
    usage: 'dms the user stuff, <command>',
    argReq: true,
    minArgs: 2,
    responses: {
      noArg: 'Who do I dm? What do i dm them?',
      lowArg: 'What do I dm them?',
    },
  },
);
