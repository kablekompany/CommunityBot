import type { Message, GuildChannel, TextChannel } from 'discord.js';
import type { ListenerOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Formatters } from 'discord.js';
import { Listener } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({ name: 'messageCreate' })
export default class extends Listener<typeof Events.MessageCreate> {
  public async run(message: Message) {
    this.censors(message);
    this.crossposts(message);
    this.dms(message);
    this.general(message);
    this.prestiges(message);
    this.trades(message);
  }

  /**
   * Manages custom censors.
   * @param msg - The discord message received by the client.
   */
  private async censors(msg: Message) {
    const { trialMod, modRole, tradeCategory, memerCategory, dramaWatcher } =
      msg.client.config.dmc;
    const categories = [tradeCategory, memerCategory];
    const modRoles = [trialMod, modRole];

    if (msg.channel.type !== 'GUILD_TEXT') return null;
    if (modRoles.some(msg.member!.roles.cache.has)) return null;
    if (!categories.includes((msg.channel as GuildChannel).parentId!))
      return null;
    if (!msg.content.match(/(dm me|pm me|msg me)/gi)) return null;

    await msg.delete();
    msg.client.util.muteMember(msg);

    const dramaChan = (await msg.client.channels.fetch(
      dramaWatcher,
    )) as TextChannel;
    return dramaChan
      .send({
        embeds: [
          {
            title: `DM Message Deleted`,
            description: [
              `**${msg.author.tag}** (\`${msg.author.id}\`) said:`,
              Formatters.codeBlock(msg.content),
              `Channel: ${msg.channel.toString()}`,
              'User has been muted for **20 minutes**.',
            ].join('\n'),
            timestamp: Date.now(),
            color: 15705088,
          },
        ],
      })
      .then(() => null);
  }

  /**
   * Manages messages to crosspost.
   * @param msg - The discord message received by the client.
   */
  private async crossposts(msg: Message) {
    const { sales, lottery } = msg.client.config.dmc;
    if (![sales, lottery].includes(msg.channel.id)) return null;

    await msg.crosspost();
    return msg.client.logger.info(
      `Message from sales/lotto channels have been crossposted at ${msg.client.util.prettyDate()}`,
    );
  }

  /**
   * Manages dm messages.
   * @param msg - The discord message received by the client.
   */
  private async dms(msg: Message) {
    if (msg.channel.type !== 'DM') return null;

    const { dmLog } = msg.client.config.logs;
    if (!dmLog.enabled) return null;

    await msg.client.util.logMsg(msg, dmLog.channel);
    return null;
  }

  /**
   * Manages messages from general chat.
   * @param msg - The discord message received by the client.
   */
  private async general(msg: Message) {
    const { general, modRole, trialMod, dramaWatcher } = msg.client.config.dmc;
    const modRoles = [modRole, trialMod];
    const hasRole = (id: string) => msg.member!.roles.cache.has(id);
    const filter =
      msg.content.toLowerCase().includes('pls') && hasRole(modRole);
    const dramas = (await msg.client.channels.fetch(
      dramaWatcher,
    )) as TextChannel;

    if (msg.channel.id !== general) return null;
    if (filter) return null;
    if (!msg.content.match(/(dm me|pm me|msg me)/gi)) return null;
    if (modRoles.some(hasRole)) return null;

    await msg.delete();
    msg.client.util.muteMember(msg);
    return dramas
      .send({
        embeds: [
          {
            title: 'DM Message Deleted',
            description: [
              `**${msg.author.tag}** (\`${msg.author.id}\`) said:`,
              Formatters.codeBlock(msg.content),
              `Channel: ${msg.channel.toString()}`,
              'User has been muted for **20 minutes**.',
            ].join('\n'),
            timestamp: Date.now(),
            color: 15705088,
          },
        ],
      })
      .then(() => null);
  }

  /**
   * Manages prestige messages.
   * @param msg - The discord message received by the client.
   */
  private async prestiges(msg: Message) {
    const { prestige, memerID } = msg.client.config.dmc;
    if (msg.channel.id !== prestige) return null;

    const filter =
      msg.content.split(' ')[2] === 'Congraulations' &&
      msg.author.id === memerID;

    if (filter) await msg.client.util.sleep(3000).then(msg.delete);
    return null;
  }

  /**
   * Manages trade messages.
   * @param msg - The discord message received by the client.
   */
  private async trades(msg: Message) {
    const { trialMod, modRole, tradeCategory, memerCategory, dramaWatcher } =
      msg.client.config.dmc;
    const categories = [tradeCategory, memerCategory];
    const modRoles = [trialMod, modRole];

    if (msg.channel.type !== 'GUILD_TEXT') return null;
    if (modRoles.some((mr) => msg.member!.roles.cache.has(mr))) return null;
    if (!(msg.channel as GuildChannel).parentId) return null;
    if (!categories.includes((msg.channel as GuildChannel).parentId!))
      return null;
    if (!msg.content.match(/(dm me|pm me|msg me)/gi)) return null;

    await msg.delete();
    msg.client.util.muteMember(msg);

    const dramaChan = (await msg.client.channels.fetch(
      dramaWatcher,
    )) as TextChannel;
    await dramaChan.send({
      embeds: [
        {
          title: `DM Message Deleted`,
          description: [
            `**${msg.author.tag}** (\`${msg.author.id}\`) said:`,
            Formatters.codeBlock(msg.content),
            `Channel: ${msg.channel.toString()}`,
            'User has been muted for **20 minutes**.',
          ].join('\n'),
          timestamp: Date.now(),
          color: 15705088, // i wanna know what color this is
        },
      ],
    });
  }
}
