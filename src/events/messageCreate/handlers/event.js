const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    if (msg.channel.id !== '847656883401129995') {
      return null;
    }

    if (!msg.content.toLowerCase().match(/^pls (share|gift|give|yeet)/g) && !msg.author.bot) {
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
