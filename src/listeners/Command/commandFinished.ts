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

@ApplyOptions<ListenerOptions>({ name: 'commandFinished' })
export default class extends Listener<typeof Events.CommandFinish> {
  public async run(
    message: Message,
    command: Command,
    payload: CommandFinishPayload<Args>,
  ) {
    const cc = await message.client.database.guilds.fetch(message.guild?.id);
    await cc.incCommands().save();
  }
}
