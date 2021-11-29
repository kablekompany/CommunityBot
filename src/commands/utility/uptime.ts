import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { Formatters } from 'discord.js';
const { bold } = Formatters;

@ApplyOptions<Command.Options>({
  aliases: ['uptime'],
  requiredUserPermissions: ['ADMINISTRATOR'],
})
export default class extends Command {
  public messageRun(msg: Message, args: Args) {
    const { parseTime } = this.container.util;

    return msg.reply({
      content: `${bold(`${msg.client.user!.tag}'s`)} uptime: ${parseTime(
        process.uptime(),
      )}`,
      allowedMentions: {
        repliedUser: false,
      },
    });
  }
}
