import type { UserModel, UserDocument } from './interface';
import type { UserCollection } from './collection';
import { UserManager } from './manager.js';
import mongoose from 'mongoose';

const { model, Schema } = mongoose;

export default (collection: UserCollection): UserModel => {
  const UserSchema = new Schema<UserDocument, UserModel, UserDocument>({
    infractions: {
      type: [String],
      default: [''],
    },
    infractionCount: {
      type: Number,
      default: 0
    }
  });

  return model<UserDocument, UserModel>(
    'user',
    UserSchema.loadClass(UserManager),
  );
};
