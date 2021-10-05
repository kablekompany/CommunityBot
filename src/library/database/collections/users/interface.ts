import type { IProps, IModel, IBaseDocument, IDocument } from '../../Interface';
import type { User } from 'discord.js';

export interface UserProfile extends IProps {
  /**
   * Represents the user's flags.
   */
  flags: number;
}

export interface UserBaseDocument extends IBaseDocument, UserProfile {
  /**
   * The user.
   */
  guild: User | null;
}

export interface UserDocument extends IDocument, UserBaseDocument {
  /**
   * Sets the user flags.
   * @param flags - The flags idk.
   */
  setFlags: (flags: number) => this;
}

export interface UserModel extends IModel<UserDocument> {
  /**
   * Fetches the user directly from the model.
   * @param id - The id of the user to fetch.
   */
  getUser(id: string): Promise<UserDocument>;
}
