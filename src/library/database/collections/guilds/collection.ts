import type { GuildDocument, GuildModel } from './interface';
import type { Database } from '#dmc/db';
import { BaseCollection } from '../../Collection.js';
import modelGuild from './model';

export class GuildCollection extends BaseCollection<GuildDocument, GuildModel> {
	public constructor(db: Database) {
		super(db, modelGuild);
	} 
}