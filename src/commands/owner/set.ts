import { Command } from '../../models/command/BaseCommand';
import { MessageOptions } from 'discord.js';

export default new Command(
	async ({ msg }): Promise<MessageOptions> => ({
		embeds: [{
			description: `**API Latency:** \`${
				Math.round(msg.guild.shard.ping)
			}ms\``
		}]
	}),
	{
		name: 'ping',
		aliases: ['ping', 'pong'],
	}
);