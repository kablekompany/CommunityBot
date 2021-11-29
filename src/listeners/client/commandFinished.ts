import type {
  Args,
  Command,
  CommandFinishPayload,
  Events,
  ListenerOptions,
} from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

export default class extends Listener<typeof Events.CommandFinish> {
  public async run(
    message: Message,
    command: Command,
    payload: CommandFinishPayload<Args>,
  ) {
    if (!message.inGuild()) return;
    const cc = await this.container.db.guilds.fetch(message.guild!.id);
    await cc.incCommands().save();
  }
}
