import { Command } from '../../models/command/BaseCommand';
import { MessageOptions } from 'discord.js';

export default new Command(
	async ({ ctx, msg, args }): Promise<MessageOptions> => {
		const user = Command.resolveUser(ctx, args.shift());
		if (!user) return { content: 'This doesn\'t seem like a real user?' };

		try {
			const dm = user.dmChannel ?? await user.createDM();
			await dm.send({
				embeds: [{
					author: {
						name: `You received a message from a server admin in ${msg.guild.name}`,
						iconURL: msg.guild.iconURL({ dynamic: true, size: 1024 })
					},
					color: ctx.utils.randomColour(),
					description: args.join(' '),
					timestamp: Date.now()
				}]
			});
			await msg.react('📨');
		} catch(e) {
			return await msg.react('❌').then(() => ({
				content: `An error occured while sending dm:\n${e.message}`
			}));
		}
	},
	{
		name: 'ping',
		aliases: ['ping', 'pong'],
	}
);