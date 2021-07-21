import { Message, Snowflake, GuildChannel, TextChannel } from 'discord.js';
import { MessageHandler } from '../../../models/handler/MessageHandler';

export default new MessageHandler(
  async function (msg: Message) {
    const { trialMod, modRole, tradeCategory, memerCategory, dramaWatcher } =
      this.config.dmc;
    const modRoles = [trialMod, modRole],
      categories = [tradeCategory, memerCategory];

    if (modRoles.some((mr) => msg.member.roles.cache.has(mr as Snowflake)))
      return null;
    if (!categories.includes((msg.channel as GuildChannel).parentId))
      return null;
    if (!msg.content.match(/(dm me|pm me|msg me)/gi)) return null;

    await msg.delete();
    this.utils.muteMember(msg);

    const dramaChan = this.bot.channels.resolve(
      dramaWatcher as Snowflake,
    ) as TextChannel;
    await dramaChan.send({
      embeds: [
        {
          title: `DM Message Deleted`,
          description: [
            `**${msg.author.tag}** (\`${msg.author.id}\`) said:`,
            this.utils.codeblock(msg.content),
            `Channel: ${msg.channel.toString()}`,
            'User has been muted for **20 minutes**.',
          ].join('\n'),
          timestamp: Date.now(),
          color: 15705088, // i wanna know what color this is
        },
      ],
    });
  },
  {
    name: 'censors',
    allowDM: false,
    allowBot: false,
  },
);
