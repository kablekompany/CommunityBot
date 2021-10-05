import {
  Message,
  MessageEmbed,
  Snowflake,
  TextChannel,
  GuildChannel,
} from 'discord.js';
import { MessageHandler } from '../../../models/handler/MessageHandler';

export default new MessageHandler(
  async function (msg: Message) {
    const { tradeCategory, dramaWatcher, tradeBuying, tradeSelling } =
      this.config.dmc;
    if ((msg.channel as GuildChannel).parentId !== tradeCategory) return null;

    const filter = (channel: string | Snowflake, word: string) => {
      const content = msg.content.toLowerCase();
      const badMsg = msg.channel.id === channel && content.includes(word);
      const safe = ['buy', 'sell'].every((w) => content.includes(w));
      return badMsg && !safe;
    };

    const dramas = this.bot.channels.resolve(dramaWatcher as Snowflake);
    const reply = (content: string) =>
      msg
        .reply({ content })
        .then(() => this.utils.sleep(7500))
        .then(() => msg.delete());
    const logMsg = (reason: string) =>
      (dramas as TextChannel).send({
        embeds: [
          {
            title: `Reason: ${reason}`,
            author: {
              name: 'Trade Message Deleted',
              icon_url: msg.author.avatarURL({ dynamic: true }),
            },
            description: [
              `**${msg.author.tag}** (\`${msg.author.id}\`) said:`,
              this.utils.codeblock(msg.content),
              `Channel: ${msg.channel.toString()}`,
            ].join('\n'),
            timestamp: Date.now(),
            color: 15705088,
          },
        ],
      });

    if (filter(tradeBuying, 'sell')) {
      await msg.delete();
      reply(
        `this channel is for buying stuff, goto <#${tradeSelling}> to sell.`,
      );
      logMsg('selling in buying-ads');
      return null;
    }

    if (filter(tradeSelling, 'buy')) {
      await msg.delete();
      reply(
        `this channel is for selling stuff, goto <#${tradeBuying}> to buy.`,
      );
      logMsg('selling in buying-ads');
      return null;
    }

    const lineCheck = msg.content.split('\n').length >= 15;
    if (lineCheck) {
      await msg.delete();
      reply('your trade-ad was 15 lines or longer, please post a shorter ad.');
      logMsg('trade was 15 lines or longer');
      return null;
    }

    return null;
  },
  {
    name: 'trading',
    allowDM: false,
    allowBot: false,
  },
);
