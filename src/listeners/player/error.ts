import type { ListenerOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

import { type CommandInteraction } from 'discord.js';
import { type Queue } from 'discord-player';
import { container } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
  emitter: container.player,
  event: 'error',
})
export default class extends Listener {
  public run(queue: Queue<CommandInteraction>, error: Error) {
    container.logger.error(
      `[${queue.guild.name}] Error emitted from the queue: ${error.message}`,
    );
  }
}
