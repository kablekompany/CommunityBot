import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { Formatters } from 'discord.js';

@ApplyOptions<Command.Options>({
  name: 'ping',
  aliases: ['pong'],
})
export default class extends Command<Args> {
  public async run(msg: Message, args: Args) {
    await msg.channel.send(
      `My ping is ${Formatters.inlineCode(
        `${msg.guild!.shard.ping}ms`,
      )} for shard ${msg.guild!.shard.id}`,
    );
  }
}
