import type { PieceContext, PieceOptions } from '@sapphire/framework';
import { Piece, Store } from '@sapphire/framework';

export class Slash extends Piece {}

export namespace Slash {
	export interface Options extends PieceOptions {}
}