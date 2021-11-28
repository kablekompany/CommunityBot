import type { ListenerOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

import { type CommandInteraction, Formatters } from 'discord.js';
import type { Queue, Track } from 'discord-player';
import { container } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
	emitter: container.player,
	event: 'trackStart',
})
export default class extends Listener {
	public async run(queue: Queue<CommandInteraction>, track: Track) {
		await queue.metadata?.followUp({
			embeds: [{
				description: `🎶 | Started playing: ${Formatters.bold(track.title)} in ${queue.connection.channel.name}!`
			}]
		});
	}
}