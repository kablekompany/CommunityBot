import type { ListenerOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

import type { Guild, TextChannel } from 'discord.js';
import type { SapphireClient } from '@sapphire/framework';

export default class extends Listener<typeof Events.ClientReady> {
  public async run(client: SapphireClient<true>) {
    await this.container.db.bootstrap(this.container.config.mongo);
    await client.stores.get('slashes').registerCommands(client);
    client.logger.info(`${client.user.tag} is now up and running.`);
    client.user.setActivity({ type: 'WATCHING', name: 'you' });
    client.user.setStatus('dnd');

    const { bootLog } = this.container.config.log;
    if (!bootLog.enabled) return null;
    const storage = (await client.channels.fetch(
      bootLog.channel,
    )) as TextChannel;
    const guilds = client.guilds.cache.map(
      (g: Guild) => `[\`${g.id}\`] - ${g.name}`,
    );
    const pages = this.container.util.paginate(guilds);

    return await storage
      .send({
        embeds: pages.map((page, idx, arr) => ({
          author: {
            name: `${client.user.tag} is online`,
          },
          color: 'BLURPLE',
          title: 'Servers:',
          description: page.join('\n'),
          footer: {
            text: `Page ${idx + 1} of ${arr.length}`,
          },
          timestamp: Date.now(),
        })),
      })
      .then(() => null);
  }
}
