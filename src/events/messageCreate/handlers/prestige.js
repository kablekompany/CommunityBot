const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    if (msg.channel.id !== ctx.config.dmc.prestige) {
      return null;
    }

    const description = msg.embeds[0]?.description;
    const filter =
      description.match(/(endgame|absolute)/g) &&
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
