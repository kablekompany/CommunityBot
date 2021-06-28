const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx }) => ({
    description: `**${ctx.bot.user.tag}'s** uptime: ${ctx.utils.parseTime(
      process.uptime(),
    )}`,
  }),
  {
    name: 'uptime',
    usage: '<command>',
    ownerOnly: true,
    argReq: false,
  },
);
