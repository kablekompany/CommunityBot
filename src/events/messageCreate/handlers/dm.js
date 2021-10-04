const MessageHandler = require('../../../models/Handlers/MessageHandler');

module.exports = new MessageHandler(
  ({ ctx, msg }) => {
    if (msg.channel.type !== 'DM') return null;
    const { dmLog } = ctx.config.log;
    if (dmLog.enabled) {
      ctx.utils.logmsg(ctx.bot, msg, dmLog.channel);
      return null;
    }
    return null;
  },
  {
    name: 'dm',
    allowDM: true,
  },
);
