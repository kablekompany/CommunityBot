const Command = require('../../models/Command/CommandModel');

const flag = '--showname';

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const user = Command.resolveUser(ctx, args.shift());

    if (!user) {
      return "This doesn't seem like a real user?";
    }

    let position = '';
    let nameFlag = false;
    if (args.includes(flag)) {
      nameFlag = true;
    }
    const role = msg.member.roles.cache.find(
      (r) =>
        r.id === ctx.config.dmc.adminRole || r.id === ctx.config.dmc.modRole
    );
    if (!role) {
      return null;
    }
    position = role.name.toLowerCase();
    try {
      await user.send({
        embeds: [
          {
            author: {
              name: `You've received a message from a ${position} in ${msg.guild.name}`,
              icon_url: msg.guild.iconURL({ dynamic: true, size: 1024 })
            },
            description: args.join(' ').replace(flag, ''),
            footer: {
              text: nameFlag ? `Sent by ${msg.author.tag}` : ''
            },
            timestamp: new Date()
          }
        ]
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
    modOnly: true,
    argReq: true,
    minArgs: 2,
    responses: {
      noArg: 'Who do I dm? What do i dm them?',
      lowArg: 'What do I dm them?'
    }
  }
);
