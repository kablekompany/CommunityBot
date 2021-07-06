const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const newPrefix = args[0];
    const guild = ctx.db.guilds.getGuild(msg.guild.id);
    if (guild.prefix === newPrefix) {
      return 'You really want me to change the current prefix to the same prefix? Okay sure, changed, as if you would notice.';
    }
    const res = await ctx.db.guilds.updatePrefix(msg.guild.id, newPrefix);
    if (res.ok !== 1) {
      return 'Hmmm something went wrong, welp.';
    }
    return {
      title: 'Prefix changed!',
      description: `Successfully changed the prefix to \`${newPrefix}\``,
    };
  },
  {
    name: 'setprefix',
    aliases: ['prefix'],
    usage: 'Change the prefix to whatever you want! <command>',
    argReq: true,
    minArgs: 1,
    adminOnly: true,
    responses: {
      noArg: 'At least give me a new prefix to set...',
    },
  },
);
