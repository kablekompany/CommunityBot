import type { CommandInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Slash } from '#dmc/structures';

import { Formatters } from 'discord.js';

@ApplyOptions<Slash.Options>({
	data: {
		name: 'ping',
		description: 'Tests my latency.'
	}
})
export default class Ping extends Slash {
	public async run(int: CommandInteraction) {
		await int.reply({
			content: `My ping is ${Formatters.inlineCode(
				`${int.guild!.shard.ping}ms`,
			)} for shard ${int.guild!.shard.id}`,
		});
	}
}