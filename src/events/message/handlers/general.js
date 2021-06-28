const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    if (msg.channel.id !== ctx.config.dmc.general) {
      return null;
    }

    const filter =
      msg.content.toLowerCase().startsWith('pls') &&
      !msg.member._roles.includes(ctx.config.dmc.modRole);

    if (filter) {
      msg.delete();
    }

    return null;
  },
  {
    name: 'general',
    allowDM: false,
    allowBot: false,
  },
);
