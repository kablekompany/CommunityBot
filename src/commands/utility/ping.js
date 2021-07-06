const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx }) => ({
    description: `**API Latency**: \`${Math.round(ctx.bot.ws.ping)}ms\``,
  }),
  {
    name: 'ping',
    usage: '<command>',
    adminOnly: true,
    argReq: false,
  },
);
