const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    if (msg.channel.id !== ctx.config.dmc.prestige) {
      return null;
    }

    const filter =
      msg.content.split(' ')[2] === 'Congratulations' &&
      msg.author.id === ctx.config.dmc.memerID;

    if (!filter) {
      setTimeout(() => msg.delete(), 3000);
    }

    return null;
  },
  {
    name: 'prestige',
    allowDM: false,
    allowBot: true,
  },
);
