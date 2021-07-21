import { MessageHandler } from '../../../models/handler/MessageHandler';
import { Message, Snowflake } from 'discord.js';

export default new MessageHandler(
  async function (msg: Message) {
    const newsChannels = [this.config.dmc.sales, this.config.dmc.lottery];
    if (!newsChannels.includes(msg.channel.id)) return null;

    await msg.crosspost();
    return console.log(
      `Message from lottery/sales channel crossposted at ${this.utils.prettyDate()}`,
    );
  },
  {
    name: 'crosspost',
    allowDM: false,
    allowBot: true,
  },
);
