import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { type Client, Formatters } from 'discord.js';

const { bold, inlineCode } = Formatters; 

@ApplyOptions<Command.Options>({
	aliases: ['stats'],
	requiredUserPermissions: ['ADMINISTRATOR']
})
export default class extends Command {
	public messageRun(msg: Message) {
		const { client: bot }: { client: Client<true> } = msg;
		const s0 = bot.ws.shards.get(0)!.

		return msg.channel.send({
			embeds: [
				{
					title: 'Bot Statistics',
					thumbnail: {
						url: 
							bot.user!.avatarURL({ dynamic: true }) 
							?? bot.user!.defaultAvatarURL
					},
					fields: [
						{
							name: 'Cache',
							value: `
								${bold('Channels')}: ${bot.channels.cache.filter(c => c.isText()).size.toLocaleString()}
								${bold('Emojis')}: ${bot.emojis.cache.size.toLocaleString()}
								${bold('Guilds')}: ${bot.guilds.cache.size.toLocaleString()}
								${bold('Users')}: ${bot.users.cache.size.toLocaleString()}
							`
						},
						{
							name: 'Latency',
							value: `
								${bold('Uptime')}: ${this.container.util.parseTime(Math.round(bot.uptime / 1000))}
								${bold('Online Since')}: ${this.container.util.parseDate(bot.readyAt)}
								${bold('Ping')}: ${bot.ws.ping}ms
							`
						}
					]
				}
			]
		})
	}
}