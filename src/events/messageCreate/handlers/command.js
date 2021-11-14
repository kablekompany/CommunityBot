const MessageHandler = require('../../../models/Handlers/MessageHandler');
const { randomColour } = require('../../../utils/misc');

module.exports = new MessageHandler(
  async ({ ctx, msg }) => {
    const guildID = msg.guild.id;
    let guild = await ctx.db.guilds.get(guildID);

    if (!guild) {
      guild = await ctx.db.guilds.initGuild(guildID);
    }

    const args = MessageHandler.argify(msg, guild.prefix);

    if (!args) {
      return null;
    }

    const command = args.shift();
    const possibleCmd =
      ctx.cmds.get(command) ||
      ctx.cmds.find((c) => c.triggers.includes(command.toLowerCase()));

    if (!possibleCmd) {
      return null;
    }

    await ctx.db.guilds.inc(guildID, 'commands');
    let possibleMsg;
    try {
      possibleMsg = await possibleCmd.execute({
        ctx,
        msg,
        args,
      });
    } catch (err) {
      console.error(err.stack);
    }

    if (possibleMsg) {
      if (possibleMsg instanceof Object) {
        if (!possibleMsg.color) {
          possibleMsg.color = randomColour();
        }
        await msg.channel.send({ embeds: [possibleMsg] });
      } else {
        await msg.channel.send(possibleMsg);
      }
    }
    return null;
  },
  {
    name: 'command',
    allowDM: false,
    allowBot: false,
  },
);
