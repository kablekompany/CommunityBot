import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { CommandFunction } from '../../../models/command/BaseCommand';
import { MessageHandler } from '../../../models/handler/MessageHandler';

export default new MessageHandler(async function (msg: Message) {
	const args = MessageHandler.argify(msg, this.config.prefix);
	if (!args) return null;

	const command = args.shift();
	const possibleCmd = this.cmds.get(command) ?? this.cmds.find(c => {
		return c.triggers.some(t => t === command.toLowerCase());
	}); 

	if (!possibleCmd) return null;

	try { 
		const returned = await possibleCmd.execute({ args, ctx: this, msg, cleanArgs: args });
		if (returned) msg.channel.send(returned);
	} catch(e) {
		console.log(e.stack);
	}
}, {
	event: 'messageCreate',
	allowDM: false,
	allowBot: false
});