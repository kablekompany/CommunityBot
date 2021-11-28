import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { type Awaitable, type Guild, Formatters } from 'discord.js';
import { ok } from '@sapphire/framework';

const { bold, inlineCode } = Formatters;

@ApplyOptions<Command.Options>({
  aliases: ['emotes'],
  requiredUserPermissions: ['ADMINISTRATOR']
})
export default class extends Command<Args> {
  public async messageRun(msg: Message, args: Args) {
    const page = args.finished ? 1 : await args.pick('number');
    let guild = await this.resolveGuild(msg, args);
    if (!this.container.util.isBotOwner(msg.author)) {
      guild = msg.guild!;
    }

    const emotes = await guild.emojis.fetch().then(emojis => {
      return emojis.map(e => `<${e.animated ? 'a' : ''}:${e.name}:${e.id}> ${inlineCode(`:${e.name}:`)}`);
    });

    const itemsPerPage = 30;
    const pages = this.container.util.paginate(emotes, itemsPerPage);
    if (pages.length < 1) {
      return msg.reply('This server doesn\'t have emojis!');
    }
    if (!pages[page - 1]) {
      return msg.reply(`Page ${bold(page.toString())} doesn't exist you dingus, there are only ${pages.length} pages.`);
    }

    const randomColor = this.container.util.randomColour();
    if (args.getFlags('all')) {
      return msg.channel.send({
        embeds: pages.map((page, idx) => ({
          description: page.join('\n'),
          color: randomColor,
          title: `Showing ${page.length} Emojis`,
          footer: {
            text: `Page ${idx} of ${pages.length}`
          }
        }))
      })
    }

    return msg.channel.send({
      embeds: [{
        title: `Showing ${pages[0].length} Emojis`,
        color: randomColor,
        description: pages[0].join('\n'),
        footer: {
          text: 'Including --all will show all emojis'
        }
      }]
    })
  }

  private resolveGuild(msg: Message, args: Args): Awaitable<Guild> {
    return args.finished ? msg.guild! : args.pick('guild').catch(() => msg.guild!);
  }
}
