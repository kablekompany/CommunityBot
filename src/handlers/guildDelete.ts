import { Snowflake, TextChannel, Guild } from 'discord.js';
import { Handler } from '../models/handler/BaseHandler';

export default new Handler<'guildDelete'>(
  async function (guild: Guild) {
    const { bootLog } = this.config.log;
    if (!bootLog.enabled) return null;

    const joinChannel = this.bot.channels.resolve(
      bootLog.channel as Snowflake,
    ) as TextChannel;
    const guildOwner = await guild.fetchOwner({ force: true });

    await joinChannel.send({
      embeds: [
        {
          title: 'Removed from Guild',
          description: [
            `**Guild Name:** ${guild.name}`,
            `**Guild ID:** ${guild.id}`,
            `**Guild Owner:** ${guildOwner.user.tag} [<@${guild.ownerId}>]`,
            `**Guild Member Count:** ${guild.memberCount.toLocaleString()}`,
          ].join('\n'),
          image: {
            url: guild.iconURL({ dynamic: true, size: 1024 }),
          },
        },
      ],
    });

    return null;
  },
  {
    event: 'guildDelete',
  },
);
