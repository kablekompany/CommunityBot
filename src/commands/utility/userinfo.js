const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    let user = args[0] || msg.author.id;
    user = ctx.bot.users.resolve(user) || msg.author;
    const member = msg.guild.members.resolve(user.id) || {
      nickname: 'Member not in server',
      joinedAt: 'Member not in server'
    };
    return {
      fields: [
        { name: '**Username**:', value: user.tag, inline: false },
        { name: '**User ID**:', value: `\`${user.id}\``, inline: false },
        {
          name: '**Nickname**:',
          value: member.nickname || 'No Nickname',
          inline: false
        },
        {
          name: '**Created At**:',
          value: ctx.utils.parseDate(user.createdAt),
          inline: false
        },
        {
          name: '**Joined At**:',
          value: ctx.utils.parseDate(member.joinedAt),
          inline: false
        }
      ],
      author: {
        name: 'User Info'
      },
      thumbnail: {
        url: user.avatarURL({ dynamic: true, size: 1024 })
      },
      color: ctx.utils.randomColour()
    };
  },
  {
    name: 'userinfo',
    aliases: ['ui'],
    usage: 'View user info for someone or yourself',
    adminOnly: true
  }
);
