/* eslint-disable no-case-declarations */
const Command = require('../../models/Command/CommandModel');

const defaultOutput =
  'You need to pass `list`, `add <prefix>` or `remove <prefix>` as an argument.';

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const [argument] = args;
    const guild = await ctx.db.guilds.get(msg.guild.id);
    switch (argument) {
      case 'add':
        if (guild.prefixes.length > 10) {
          return 'This server has 10 prefixes already, maybe remove one first?';
        }
        const newPrefix = args[1];
        if (newPrefix.length > 5) {
          return 'Choose a shorter prefix or something.';
        }
        if (guild.prefixes.includes(newPrefix)) {
          return 'This prefix already exists, run the `prefix list` command to view all prefixes.';
        }
        await ctx.db.guilds.addPrefix(msg.guild.id, newPrefix);
        return {
          title: 'Prefix added!',
          description: `Successfully added \`${newPrefix}\` as a prefix.`,
        };
      case 'list':
        const { prefixes } = await ctx.db.guilds.get(msg.guild.id);
        return {
          title: 'All Prefixes',
          description: prefixes.map((p, idx) => `${idx + 1}. ${p}`).join('\n'),
          color: ctx.utils.randomColour(),
        };
      case 'remove':
        const toRemove = args[1];
        if (!guild.prefixes.includes(toRemove)) {
          return {
            description: `This isn't even a prefix, what are you trying to do? Run \`${guild.prefixes[0]} prefix list\` to see all prefixes.`,
          };
        }
        if (guild.prefixes.length === 1) {
          return {
            description:
              "lol you only have one prefix, pretty sure you don't wanna do this",
          };
        }
        await ctx.db.guilds.removePrefix(msg.guild.id, toRemove);
        return {
          title: 'Prefix removed!',
          description: `Successfully removed \`${toRemove}\` as a prefix.`,
        };
      default:
        return defaultOutput;
    }
  },
  {
    name: 'prefix',
    usage: 'Change the prefix to whatever you want! <command>',
    argReq: true,
    minArgs: 1,
    modOnly: true,
    responses: {
      noArg: defaultOutput,
    },
  },
);
