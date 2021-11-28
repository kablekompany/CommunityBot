import type { GuildModel, GuildDocument, GuildBaseDocument } from './interface';
import type { GuildCollection } from './collection';
import { GuildManager } from './manager.js';
import { container } from '@sapphire/framework';
import mongoose from 'mongoose';

const { model, Schema } = mongoose;

export default (collection: GuildCollection): GuildModel => {
  const GuildSchema = new Schema<GuildDocument, GuildModel, GuildDocument>({
    prefix: {
      type: String,
      default: container.config.prefix,
    },
    commands: {
      type: Number,
      default: 0,
    },
  });

  return model<GuildDocument, GuildModel>('guild', GuildSchema.loadClass(GuildManager));
};
