import type { ListenerOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

export default class extends Listener<typeof Events.Error> {
  public async run(error: Error) {
    this.container.logger.error(error.stack ?? error);
    return null;
  }
}
