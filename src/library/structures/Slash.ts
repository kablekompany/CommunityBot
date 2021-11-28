import type { ApplicationCommandData, Awaitable, CommandInteraction } from 'discord.js';
import { Piece, Store, type PieceContext, type PieceOptions } from '@sapphire/framework';

export class Slash extends Piece<Slash.Options> {
	public data: ApplicationCommandData;
	public constructor(ctx: PieceContext, options: Slash.Options) {
		super(ctx, options);
		this.data = options.data;
	}
}

export namespace Slash {
	export interface Options extends PieceOptions {
		data: ApplicationCommandData;
	}
}