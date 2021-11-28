import type { ListenerOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';
import type { Queue } from 'discord-player';
import { container } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
  emitter: container.player,
  event: 'queueEnd',
})
export default class extends Listener {
  public async run(queue: Queue<CommandInteraction>) {
    await queue.metadata?.followUp({
      embeds: [{ description: '✅ | Queue finished!' }],
    });
  }
}
