import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

@ApplyOptions<Command.Options>({
  aliases: ['reload'],
  preconditions: ['OwnerOnly'],
})
export default class extends Command {
  public messageRun(msg: Message, args: Args) {}
}
