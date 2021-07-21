import { Snowflake, TextChannel, MessagePayload } from 'discord.js';
import { Handler } from '../models/handler/BaseHandler';

export default new Handler<'ready'>(
  async function () {
    console.log(`${this.bot.user.tag} is now up and running.`);
    await this.bot.user.setActivity({ type: 'WATCHING', name: 'you' });
    await this.bot.user.setStatus('dnd');

    const { bootLog } = this.config.log;
    if (!bootLog.enabled) return null;

    const storage = this.bot.channels.resolve(
      bootLog.channel as Snowflake,
    ) as TextChannel;
    const guilds = this.bot.guilds.cache.map(
      (g) => `[\`${g.id}\`] - ${g.name}`,
    );
    const pages = this.utils.paginate(guilds);

    await Promise.all(
      pages.map((page, i, a) =>
        storage.send({
          embeds: [
            {
              title: 'Servers:',
              author: {
                name: `${this.bot.user.username} is online`,
              },
              description: page,
              footer: {
                text: `Page ${i + 1} of ${a.length}`,
              },
              timestamp: Date.now(),
            },
          ],
        }),
      ),
    );

    return null;
  },
  {
    event: 'ready',
  },
);
