import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
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

    try {
      const returned = await possibleCmd.execute({
        args,
        ctx: this,
        msg,
        cleanArgs: args,
      });
      if (returned) msg.channel.send(returned);
    } catch (e) {
      console.log(e.stack);
    }
  },
  {
    name: 'command',
    allowDM: false,
    allowBot: false,
  },
);
