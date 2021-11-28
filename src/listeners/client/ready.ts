import type { ListenerOptions, Events } from '@sapphire/framework';
import type { Client, Guild, TextChannel } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

export default class extends Listener<typeof Events.ClientReady> {
  public async run(client: Client<true>) {
    client.logger.info(`${client.user!.tag} is now up and running.`);
    client.user!.setActivity({ type: 'WATCHING', name: 'you' });
    client.user!.setStatus('dnd');

    const { bootLog } = client.config.logs;
    if (!bootLog.enabled) return null;
    const storage = (await client.channels.fetch(
      bootLog.channel,
    )) as TextChannel;
    const guilds = client.guilds.cache.map(
      (g: Guild) => `[\`${g.id}\`] - ${g.name}`,
    );
    const pages = client.util.paginate(guilds);

    return await storage
      .send({
        embeds: pages.map((page, idx, arr) => ({
          author: {
            name: `${client.user!.tag} is onling`,
          },
          color: 'BLURPLE',
          title: 'Servers:',
          description: page,
          footer: {
            text: `Page ${idx + 1} of ${arr.length}`,
          },
          timestamp: Date.now(),
        })),
      })
      .then(() => null);
  }
}
