import { ApplyOptions } from '@sapphire/decorators';
import { Argument } from '@sapphire/framework';

import type { StoreRegistryEntries } from '@sapphire/pieces';
import { isNullOrUndefined } from '@sapphire/utilities';
import { type Guild } from 'discord.js';

export default class extends Argument {
  public async run(parameter: string, ctx: Argument.Context) {
    const store = this.container.stores.get(parameter);
    return store
      ? this.ok(store)
      : this.error({ parameter, message: 'Unknown store.' });
  }
}

declare module '@sapphire/framework' {
  interface ArgType {
    store: StoreRegistryEntries[keyof StoreRegistryEntries];
  }
}
