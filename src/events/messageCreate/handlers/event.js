const MessageHandler = require('../../../models/Handlers/MessageHandler');

// 754405049274204170 admin

// 804123118306197504 community

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    const immune = ['754405049274204170', '804123118306197504'];
    if (msg.channel.id !== '847656883401129995') {
      return null;
    }

    const isImmune = immune.some(i => msg.member.roles.cache.has(i));
    if (!msg.content.toLowerCase().match(/^pls (share|gift|give|yeet)/g) && !msg.author.bot && !isImmune) {
      await msg.delete();
    }

    return null;
  },
  {
    name: 'event',
    allowDM: false,
    allowBot: true,
  },
);
