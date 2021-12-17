import type { IProps, IModel, IBaseDocument, IDocument } from '../../Interface';
import type { User } from 'discord.js';

export interface UserProfile extends IProps {
  /**
   * Represents the user's infraction info.
   */
  infractions: string[];
  infractionCount: number;
}

export interface UserBaseDocument extends IBaseDocument, UserProfile {
  /**
   * The user.
   */
  guild: User | null;
}

export interface UserDocument extends IDocument, UserBaseDocument {
  /**
   * Logs an infraction for the user.
   * @param id The user's id
   * @param msgLink The message link of the infraction.
   */
  addInfraction: (id: string, msgLink: string) => this;
}

export interface UserModel extends IModel<UserDocument> {
  /**
   * Fetches the user directly from the model.
   * @param id - The id of the user to fetch.
   */
  getUser(id: string): Promise<UserDocument>;
}
