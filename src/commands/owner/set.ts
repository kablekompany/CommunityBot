import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import type { ActivityType, ClientPresenceStatus } from 'discord.js';
import type { Result, UserError } from '@sapphire/framework';
import { Formatters } from 'discord.js';

const { bold, inlineCode: ic } = Formatters;

type SetAction = 'activity' | 'avatar' | 'status' | 'username';

type SupportedActivityTypes = Exclude<ActivityType, 'CUSTOM' | 'STREAMING'>;

@ApplyOptions<Command.Options>({
  aliases: ['set'],
  preconditions: ['OwnerOnly'],
})
export default class extends Command {
  public async messageRun(msg: Message, args: Args) {
    const action = (await args.pickResult('string')) as Result<
      SetAction,
      UserError
    >;
    if (
      action.error ||
      !this.actions.includes(action.value.toLowerCase() as SetAction)
    ) {
      return msg.reply(`
        What exactly do you want me to set?
        ${ic(this.actions.join(ic(', ')))}
      `);
    }

    switch (this.actions.find((a) => a === action.value.toLowerCase())!) {
      case 'activity': {
        const type = (await args.pickResult('string')) as Result<
          SupportedActivityTypes,
          UserError
        >;
        if (type.error || !this.activityTypes.includes(type.value)) {
          return msg.reply(`
            Activity type can only be one of the following: 
            ${ic(this.activityTypes.join(ic(', ')))}
          `);
        }

        await msg.client.user!.setActivity({ type: type.value });
        break;
      }

      case 'avatar': {
        const av = await args.pickResult('string');
        if (av.error) {
          return msg.reply('You need an image link for your avatar.');
        }

        await msg.client
          .user!.setAvatar(av.value)
          .catch(this.handleError.bind(msg));
        break;
      }

      case 'username': {
        const un = await args.pickResult('string');
        if (un.error) return msg.reply('Give me a username smh');
        await msg.client
          .user!.setUsername(un.value)
          .catch(this.handleError.bind(msg));
        break;
      }

      case 'status': {
        const st = (await args.pickResult('string')) as Result<
          ClientPresenceStatus,
          UserError
        >;
        if (st.error || !this.presenceTypes.includes(st.value)) {
          return msg.reply(`
            Status type can only be from one of the following:
            ${ic(this.presenceTypes.join(ic(', ')))}
          `);
        }

        await msg.client.user!.setStatus(st.value);
        break;
      }
    }

    return msg.reply(`Changed ${action}, maybe`);
  }

  private handleError(this: Message, error: Error) {
    return this.channel.send(`${bold('Error:')} ${error.message}`);
  }

  private get actions(): SetAction[] {
    return ['activity', 'avatar', 'status', 'username'];
  }

  private get activityTypes(): SupportedActivityTypes[] {
    return ['WATCHING', 'COMPETING', 'LISTENING', 'PLAYING'];
  }

  private get presenceTypes(): ClientPresenceStatus[] {
    return ['online', 'dnd', 'idle'];
  }
}
