const OwnerCommand = require('../../models/Command/OwnerCommand');

const options = ['activity', 'avatar', 'status', 'username'];
const activityTypes = [
  'PLAYING',
  'STREAMING',
  'LISTENING',
  'WATCHING',
  'COMPETING'
];
const statusTypes = ['online', 'idle', 'invisible', 'dnd'];

module.exports = new OwnerCommand(
  async ({ ctx, msg, args }) => {
    if (!options.includes(args[0])) {
      return `What exactly do you want me to set?\n\`${options.join('`, `')}\``;
    }
    const toChange = args.shift();
    try {
      if (toChange.toLowerCase() === 'activity') {
        const type = args.shift();
        if (!activityTypes.includes(type)) {
          return `Activity type can only be the following\n\`${activityTypes.join(
            '`, `'
          )}\``;
        }
        ctx.bot.user.setActivity(args.join(' '), { type });
      } else if (toChange === 'status') {
        const status = args.shift();
        if (!statusTypes.includes(status)) {
          return `Status type can only be the from the following\n\`${statusTypes.join(
            '`, `'
          )}\``;
        }
        ctx.bot.user.setStatus(status);
      } else if (toChange === 'avatar') {
        const avatarUrl = args.shift();
        if (!avatarUrl) return 'Provide an image link for the new avatar';
        ctx.bot.user
          .setAvatar(avatarUrl)
          .catch((e) => msg.channel.send(`Error: \`${e.message}\``));
      } else if (toChange === 'username') {
        const username = args.join(' ');
        if (!username) return 'give me a username smh';
        ctx.bot.user
          .setUsername(username)
          .catch((e) => msg.channel.send(`Error: \`${e.message}\``));
      }
    } catch (err) {
      return err.msg;
    }
    return `Changed ${toChange}, maybe`;
  },
  {
    name: 'set',
    usage: 'change activity',
    argReq: true,
    minArgs: 1,
    responses: {
      noArg: `What exactly do you want me to set?\n\`${options.join('`, `')}\``
    }
  }
);
