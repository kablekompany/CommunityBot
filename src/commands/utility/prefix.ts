import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { Formatters } from 'discord.js';

@ApplyOptions<Command.Options>({
  aliases: ['prefix', 'setprefix'],
})
export default class extends Command<Args> {
  public async messageRun(msg: Message, args: Args) {
    const newPrefix = args.finished ? null : await args.rest('string');
    if (!newPrefix) return msg.reply('You actually need a prefix to set, smh');

    const m = await msg.reply('Changing prefix...');
    try {
      const db = await this.container.db.guilds.fetch(msg.guild!.id);
      if (newPrefix === db.prefix) {
        return m.edit(
          'U really want me to change to the same prefix over again? Okay, changed, as you would notice.',
        );
      }

      await db.setPrefix(newPrefix).save();
      return m.edit(
        `Successfully changed the prefix to ${Formatters.inlineCode(
          newPrefix,
        )}`,
      );
    } catch {
      return m.edit('Cannot change prefix due to an error.');
    }
  }
}
