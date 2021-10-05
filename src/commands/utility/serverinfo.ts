import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

import type { Guild, Base, EmbedFieldData } from 'discord.js';
import { Collection, Formatters } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'serverinfo',
	aliases: ['si']
})
export default class extends Command<Args> {
	public async run(msg: Message, args: Args) {
		return msg.channel.send({
			embeds: [{
				fields: [
					['Server', this.getGuild(msg.guild!)],
					['Owner', await this.getOwner(msg.guild!)],
					['Stats', this.getStats(msg.guild!)]
				].map(([name, value]) => ({ 
					name, 
					value, 
					inline: true 
				})),
				author: {
					name: 'Server Info',
				},
				thumbnail: {
					url: msg.guild!.iconURL({ dynamic: true, size: 1024 }) ?? undefined,
				},
				footer: {
					text: `Created: ${msg.client.util.parseDate(msg.guild!.createdAt)}`
				},
				color: msg.client.util.randomColour()
			}]
		});
	}

	private getGuild(guild: Guild): string {
		const k = ['Name', 'ID', 'Verification'];
		const v = [guild.name, Formatters.inlineCode(guild.id), guild.verificationLevel.toLowerCase()];

		const m = k.map((k, i) => `${Formatters.bold(k)}: ${v[i]}`);
		return guild.client.util.join(m);
	} 

	private async getOwner(guild: Guild): Promise<string> {
		const { user, nickname, id } = await guild.fetchOwner({ force: true, cache: true });

		const k = ['Tag', 'Nickname', 'ID'];
		const v = [user.tag, nickname ?? 'No nickname', id];

		const m = k.map((k, i) => `${Formatters.bold(k)}: ${v[i]}`);
		return guild.client.util.join(m);
	}

	private getStats(guild: Guild): string {
		const format = (col: { cache: Collection<string, Base>}): string => 
			col.cache.size.toLocaleString();

		const k = ['Channels', 'Emotes', 'Roles', 'Members'];
		const v = [guild.channels, guild.emojis, guild.roles, guild.members].map(format);

		const m = k.map((k, i) => `${Formatters.bold(k)}: ${v[i]}`);
		return guild.client.util.join(m);
	}
}