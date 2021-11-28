import type { UserModel, UserDocument, UserBaseDocument } from './interface';
import { container } from '@sapphire/framework';

export class UserManager {
  public static getUser(this: UserModel) {
    const thisUser =
      (await this.findById({ _id: id })) ?? (await this.create({ _id: id }));
    return thisUser;
  }

  public get user(this: UserBaseDocument) {
    return container.client.users.cache.get(this) ?? null;
  }

  public setFlags(this: UserDocument, flags: number) {
    this.flags = flags;
    return this;
  }
}
