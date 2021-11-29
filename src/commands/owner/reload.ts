import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { Formatters } from 'discord.js';

const { inlineCode: ic } = Formatters;

@ApplyOptions<Command.Options>({
  aliases: ['reload'],
  preconditions: ['OwnerOnly'],
})
export default class extends Command {
  public async messageRun(msg: Message, args: Args) {
    const store = await args.pickResult('store');
    if (store.error) {
      return msg.reply(`
        These are the only available stores:
        ${ic(this.container.stores.map((_, k) => k).join(ic(', ')))}
      `);
    }

    await store.value.loadAll();
    await msg.reply(
      `Reloaded the ${ic(store.value.Constructor.name.toLowerCase())} store.`,
    );
  }
}
