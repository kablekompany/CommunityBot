import type { ListenerOptions, Events } from '@sapphire/framework';
import type { Interaction, ClientEvents } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({ name: 'guildDelete' })
export default class extends Listener<'interactionCreate'> {
  public async run(...[int]: ClientEvents['interactionCreate']) {
    // sapphire said they'll release "slashies" soon:tm:
  }
}
