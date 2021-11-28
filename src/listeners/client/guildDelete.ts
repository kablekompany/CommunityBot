import type { ListenerOptions, Events } from '@sapphire/framework';
import type { Guild, TextChannel } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

export default class extends Listener<typeof Events.GuildDelete> {
  public async run(guild: Guild) {
    const { bootLog } = guild.client.config.logs;
    if (!bootLog.enabled) return null;

    const joinChannel = (await guild.client.channels.fetch(
      bootLog.channel,
    )) as TextChannel;
    const owner = await guild.fetchOwner({ force: true });

    await joinChannel.send({
      embeds: [
        {
          title: 'Removed from Guild',
          description: [
            `**Guild Name:** ${guild.name}`,
            `**Guild ID:** ${guild.id}`,
            `**Guild Owner:** ${owner.user.tag} [<@${owner.user.id}>]`,
            `**Guild Member Count:** ${guild.memberCount.toLocaleString()}`,
          ].join('\n'),
          image: {
            url:
              guild.iconURL({ dynamic: true, size: 1024 }) ??
              owner.user.avatarURL({ dynamic: true, size: 1024 }) ??
              owner.user.defaultAvatarURL,
          },
        },
      ],
    });

    return null;
  }
}
