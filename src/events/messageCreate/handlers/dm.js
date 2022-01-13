const MessageHandler = require('../../../models/Handlers/MessageHandler');
const {
  log: { dmLog }
} = require('../../../configs/config.json');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    if (msg.channel.type !== 'DM' || !dmLog.enabled) {
      return null;
    }
    return ctx.utils.logMessage(ctx.bot, msg, dmLog.channel);
  },
  {
    name: 'dm',
    allowDM: true
  }
);
