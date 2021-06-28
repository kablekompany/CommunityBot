const pflags = require('discord.js').Permissions.FLAGS;
const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, msg }) => {
    const memberPerms = msg.member.permissions;
    const perms = [];
    const fields = [];
    Object.keys(pflags).forEach((flag) => {
      if (memberPerms.has(flag)) {
        perms.push(flag);
      }
    });
    const { length } = perms;
    if (perms.length > 15) {
      fields.push([
        {
          name: 'Permissions',
          value: perms.splice(0, 15),
          inline: true,
        },
        {
          name: 'More perms',
          value: perms.splice(15, length),
          inline: true,
        },
      ]);
      return {
        title: 'Permissions',
        fields,
      };
    }
    return {
      description: ctx.utils.codeblock(perms.join('\n'), 'json'),
    };
  },
  {
    name: 'permissions',
    aliases: ['perms'],
    usage: '<command>',
    argReq: false,
  },
);
