import type {
  ApplicationCommandData,
  Awaitable,
  CommandInteraction,
} from 'discord.js';
import {
  Piece,
  Store,
  type PieceContext,
  type PieceOptions,
  type SapphireClient,
} from '@sapphire/framework';
import { type BotUtils } from '#dmc/client';

export class SlashStore extends Store<Slash> {
  public constructor() {
    super(Slash as BotUtils.Constructor<Slash>, {
      name: 'slashes',
    });
  }

  public async registerCommands(client: SapphireClient<true>) {
    await client.application.commands.set(this.map((slash) => slash.data));
  }
}

export abstract class Slash extends Piece<Slash.Options> {
  public data: ApplicationCommandData;
  public constructor(ctx: PieceContext, options: Slash.Options) {
    super(ctx, { ...options, name: options.data.name });
    this.data = options.data;
  }

  public abstract run(interaction: CommandInteraction): Awaitable<unknown>;
}

export namespace Slash {
  export interface Options extends PieceOptions {
    data: ApplicationCommandData;
  }
}

declare module '@sapphire/pieces' {
  interface StoreRegistryEntries {
    slashes: SlashStore;
  }
}