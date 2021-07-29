import { Message, MessageOptions } from 'discord.js';
import { MessageHandler } from '../../../models/handler/MessageHandler';

export default new MessageHandler(
  async function (msg: Message) {
    const guild =
      (await this.db.guilds.get(msg.guild.id)) ??
      (await this.db.guilds.init(msg.guild.id));

    const args = MessageHandler.argify(msg, guild.prefix);
    if (!args) return null;

    const command = args.shift();
    const possibleCmd =
      this.cmds.get(command) ??
      this.cmds.find((c) =>
        c.triggers.some((t) => t === command.toLowerCase()),
      );

    if (!possibleCmd) return null;
    await this.db.guilds.inc(msg.guild.id, 'commands');

    let returned: string | MessageOptions;
    try {
      returned = await possibleCmd.execute({
        args,
        ctx: this,
        msg,
        cleanArgs: args,
      });
    } catch (e) {
      console.log(e.stack);
    }

    if (returned) {
      if (returned instanceof Array) {
        msg.channel.send({ embeds: returned });
      } else {
        msg.channel.send(returned);
      }
    }
  },
  {
    name: 'command',
    allowDM: false,
    allowBot: false,
  },
);
