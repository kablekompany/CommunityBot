import type { UserModel, UserDocument, UserBaseDocument } from './interface';
import type { UserCollection } from './collection';
import mongoose from 'mongoose';

const { model, Schema } = mongoose;

export default (collection: UserCollection): UserModel => {
	const GuildSchema = new Schema<UserDocument, UserModel, UserDocument>({
		flags: {
			type: Number,
			default: 0
		}
	});

	GuildSchema.virtual('user').get(function (this: UserBaseDocument) {
		return collection.db.client.users.cache.get(this._id) ?? null;
	});

	/**
	 * Fetches the user directly from the model.
	 * @param this - The user model.
	 * @param id - The id of the user to fetch.
	 */
	GuildSchema.statics.getUser = async function (this: UserModel, id: string) {
		const thisUser = await this.findById({ _id: id }) ?? await this.create({ _id: id });
		return thisUser;
	}
	/**
	 * Sets the user flags.
	 * @param flags - The flags idk.
	 */
	GuildSchema.methods.setFlags = function (this: UserDocument, flags: number) {
		this.flags = flags;
		return this;
	}

	return model<UserDocument, UserModel>('user', UserSchema);
};