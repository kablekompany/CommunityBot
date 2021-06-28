const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    const newsChannels = [ctx.config.dmc.sales, ctx.config.dmc.lottery];

    if (!newsChannels.includes(msg.channel.id)) {
      return null;
    }

    msg.crosspost();
    return console.log(
      `Crossposted message from lottery/sales channel at ${ctx.utils.prettyDate()}`,
    );
  },
  {
    name: 'crosspost',
    allowDM: false,
    allowBot: true,
  },
);
