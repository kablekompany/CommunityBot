import type { IDocument, IModel } from './Interface';
import type { CommunityBot } from '#dmc/client';
import type { Database } from './Database';
import type { Model } from 'mongoose';
import { Collection } from 'discord.js';

export class BaseCollection<
  D extends IDocument,
  M extends IModel<D>,
> extends Collection<string, D> {
  public db: Database;
  public model: Model<D>;
  public constructor(
    db: Database,
    model: (collection: BaseCollection<D, M>) => Model<D>,
  ) {
    super();
    this.db = db;
    this.model = model(this);
  }

  /**
   * Get a document from the database.
   * @param _id - The id of the document to fetch.
   * @param force - Whether to fetch it directly from the database. Useful if you made manual changes from the site.
   */
  public async fetch(_id: string, force = false) {
    const cached = super.get(_id);
    if (cached && !force) return cached;

    const doc =
      (await this.model.findById({ _id })) ??
      (await this.model.create({ _id }));
    super.set(_id, doc);
    return doc;
  }

  /**
   * Deletes a document entry from the database.
   * @param _id - The id of the document to delete.
   */
  public async remove(_id: string) {
    const doc = await this.get(_id);
    await doc.delete();
    super.delete(_id);
    return doc;
  }

  /**
   * Fetches all documents from this collection.
   * @param cache - Whether to cache fetched documents or not.
   */
  public async fetchAll(cache = false): Promise<D[]> {
    const docs = await this.model.find({}).exec();
    if (cache)
      for (const doc of docs) {
        super.set(doc._id, doc);
      }

    return docs;
  }
}
