import type { UserDocument, UserModel } from './interface';
import type { Database } from '#dmc/db';
import { BaseCollection } from '../../Collection.js';
import modelUser from './model';

export class UserCollection extends BaseCollection<UserDocument, UserModel> {
	public constructor(db: Database) {
		super(db, modelUser);
	} 
}