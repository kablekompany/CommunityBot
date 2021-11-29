import type { UserModel, UserDocument, UserBaseDocument } from './interface';
import { container } from '@sapphire/framework';

export class UserManager {
  public static async getUser(this: UserModel, id: string) {
    const thisUser =
      (await this.findById({ _id: id })) ?? (await this.create({ _id: id }));
    return thisUser;
  }

  public get user() {
    return container.client.users.cache.get((this as unknown as UserBaseDocument)._id) ?? null;
  }

  public setFlags(this: UserDocument, flags: number) {
    this.flags = flags;
    return this;
  }
}
