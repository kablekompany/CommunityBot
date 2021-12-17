import type { UserModel, UserDocument, UserBaseDocument } from './interface';
import { container } from '@sapphire/framework';
import { Condition, ObjectId } from 'mongoose';

export class UserManager {
  public static async getUser(this: UserModel, id: string) {
    const thisUser =
      (await this.findById({ _id: id })) ?? (await this.create({ _id: id }));
    return thisUser;
  }

  public get user() {
    return container.client.users.cache.get((this as unknown as UserBaseDocument)._id) ?? null;
  }

  public async addInfraction(this: UserDocument, id: string, msgLink: string) {
    await this.collection.updateOne({ _id: id as Condition<ObjectId> }, {
      $inc: {
        infractionCount: 1,
      },
      $push: { infractions: { $each: [msgLink], $slice: -5 } },
    }, { upsert: true });
    return this;
  }
}
