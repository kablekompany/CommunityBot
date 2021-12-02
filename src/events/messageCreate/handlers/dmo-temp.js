const MessageHandler = require('../../../models/Handlers/MessageHandler');

const dmo = {
  moderator: '487255175807893504',
  applyForMod: '915773162128572426',
};

module.exports = new MessageHandler(
  async ({ msg }) => {
    if (msg.channel.id !== dmo.applyForMod) {
      return null;
    }
    const immune = msg.member._roles.includes(dmo.moderator);
    if (!msg.content.match(/^;;apply/gi) && !immune) {
      await msg.delete();
    }
    return null;
  },
  {
    name: 'dmo-temp',
    allowDM: false,
    allowBot: false,
  },
);
