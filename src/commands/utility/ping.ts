import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { Formatters } from 'discord.js';

@ApplyOptions<Command.Options>({
  name: 'ping',
  aliases: ['pong'],
})
export default class extends Command<Args> {
  public async messageRun(msg: Message, args: Args) {
    const { bold, inlineCode } = Formatters;
    const ping = msg.client.ws.ping;

    await msg.channel.send(`${bold('API Latency:')} ${inlineCode(ping.toString())}`);
  }
}
