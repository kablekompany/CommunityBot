/* eslint-disable no-case-declarations */
const Command = require('../../models/Command/CommandModel');

const defaultOutput =
  'You need to pass `list`, `add <word>` or `remove <word>` as an argument.';

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const [argument] = args;
    const validSubCommands = ['add', 'remove', 'list'];
    if (!validSubCommands.includes(argument)) {
      return defaultOutput;
    }
    const { censors } = await ctx.db.automod.get(msg.guild.id);
    switch (argument) {
      case 'add':
        const censor = args.slice(1).join(' ');
        if (censor.length < 3) {
          return 'Censors need 3+ characters.';
        }
        if (censors.includes(censor)) {
          return 'This prefix already exists, run the `prefix list` command to view all prefixes.';
        }
        await ctx.db.automod.genericAdd(msg.guild.id, censor, 'censor');
        return {
          title: 'Censor added',
          description: `Successfully added \`${censor}\` as a censor. Run \`d!censor list\` to see all censors.`
        };
      case 'list':
        if (!censors || !censors.length) {
          return "I wasn't able to find any censors for this server.";
        }
        return {
          title: 'All Censors',
          description: censors.map((p, idx) => `${idx + 1}. ${p}`).join('\n'),
          color: ctx.utils.randomColour()
        };
      case 'remove':
        const toRemove = args.slice(1).join(' ');
        if (!censors.includes(toRemove)) {
          return {
            description:
              "This isn't a censor, maybe check the censor list first?"
          };
        }
        await ctx.db.automod.genericRemove(msg.guild.id, toRemove, 'censor');
        return {
          title: 'Censor removed',
          description: `Successfully removed \`${toRemove}\` as a censor. Run \`d!censor list\` to see all censors.`
        };
      // todo: add a 'clear' case with button confirmation
      default:
        return defaultOutput;
    }
  },
  {
    name: 'censor',
    usage: 'Add, remove or list current censors',
    argReq: true,
    minArgs: 1,
    adminOnly: true,
    responses: {
      noArg: defaultOutput
    }
  }
);
