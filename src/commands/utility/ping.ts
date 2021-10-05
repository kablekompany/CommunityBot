import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

import { Formatters } from 'discord.js';

@ApplyOptions<CommandOptions>({
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
