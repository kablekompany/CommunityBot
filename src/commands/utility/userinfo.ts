import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { Formatters } from 'discord.js';
const { bold } = Formatters;

@ApplyOptions<Command.Options>({
  aliases: ['userinfo', 'ui'],
  requiredUserPermissions: ['ADMINISTRATOR']
})
export default class extends Command {
  public async messageRun(msg: Message, args: Args) {
    const member = args.finished ? msg.member! : await args.rest('member');

    await msg.channel.send({
      embeds: [
        {
          author: {
            name: 'User Info',
          },
          thumbnail: {
            url: member.user.avatarURL({ dynamic: true }) ?? member.user.defaultAvatarURL,
          },
          color: this.container.util.randomColour(),
          fields: [
            {
              name: bold('Username:'),
              value: member.user.username,
            },
            {
              name: bold('User ID:'),
              value: member.user.id,
            },
            {
              name: bold('Nickname:'),
              value: member.nickname ?? 'No Nickname',
            },
            {
              name: bold('Created At:'),
              value: this.container.util.parseDate(member.user.createdAt),
            },
            {
              name: bold('Joined At:'),
              value: this.container.util.parseDate(new Date(member.joinedTimestamp!))
            }
          ]
        }
      ]
    })
  }
}
