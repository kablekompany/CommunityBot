import {
  MessageEmbedOptions,
  MessageOptions,
  Client,
  Snowflake,
} from 'discord.js';
import { Command } from '../../models/command/BaseCommand';

function resolveGuild(this: Client, guildId: Snowflake) {
  return this.guilds.cache.get(guildId);
}

export default new Command(
  async ({ ctx, msg, args }): Promise<MessageOptions> => {
    let { guild } = msg;
    let [page = 1] = args;

    if (!Number.isInteger(Number(page))) {
      return { content: 'Invalid page number, buddy' };
    }
    if (ctx.config.owners.includes(msg.author.id)) {
      guild = resolveGuild.call(
        ctx.bot,
        (args[1] ? args[0] : guild.id) as Snowflake,
      );
      page = args[1] ?? args[0];
    }

    const emojis = await guild.emojis.fetch().then((emjs) => {
      return emjs.map(
        (e) => `<${e.animated ? 'a' : ''}:${e.name}:${e.id}> \`:${e.name}:\``,
      );
    });

    const pages = ctx.utils.paginate(emojis);
    if (Number(page) > pages.length) {
      return {
        content: `Page **${page}** doesn't exist you dingus, there are only ${pages.length} total pages.`,
      };
    }

    const color = ctx.utils.randomColour();
    const embeds: MessageEmbedOptions[] = pages.map((p, i, a) => ({
      title: `Server Emotes — ${guild.name}`,
      color,
      description: p,
      footer: {
        text: `Page ${i + 1} of ${a.length}`,
      },
    }));

    return !['-all', '-a'].includes(msg.content)
      ? { embeds: [embeds[Number(page) - 1]] }
      : { embeds };
  },
  {
    name: 'emotes',
    aliases: ['le', 'listemotes'],
    adminOnly: true,
    usage: '{command" [page] [guildId]',
  },
);
