class BaseCollection {
  constructor(collection) {
    this.collection = collection;
    this.currentID = 0;
  }

  async get(_id) {
    return {
      ...this.default,
      ...(await this.collection.findOne({ _id })),
    };
  }

  getAll() {
    return this.find({});
  }

  getLatest() {
    return this.collection.findOne({}, { sort: { $natural: -1 } });
  }

  find(query) {
    return this.collection
      .find({
        ...query,
      })
      .toArray();
  }

  update(_id, query) {
    return this.collection.updateOne({ _id }, { ...query }, { upsert: true });
  }

  inc(_id, field, amount = 1) {
    return this.update(_id, {
      $inc: {
        [field]: amount,
      },
    });
  }

  set(_id, field, value) {
    return this.update(_id, {
      $set: {
        [field]: value,
      },
    });
  }

  unset(_id, field) {
    return this.update(_id, {
      $unset: {
        [field]: 0,
      },
    });
  }

  toggle(_id, field) {
    return this.update(_id, {
      $bit: {
        [field]: {
          xor: 1,
        },
      },
    });
  }

  del(_id) {
    return this.collection.deleteOne({ _id });
  }

  async _exists(query) {
    return !!(await this.collection.findOne({ ...query }));
  }

  async exists(userID) {
    return this._exists({ userID });
  }

  async getIncrementingID() {
    if (!this.currentID) {
      const currentIDResult = await this.collection.findOne({
        currentID: { $exists: true },
      });
      if (currentIDResult) {
        this.currentID = currentIDResult.currentID;
      } else {
        this.collection.insertOne({ currentID: 0 });
        this.currentID = 0;
      }
    }

    this.collection.updateOne(
      { currentID: { $exists: true } },
      { $inc: { currentID: 1 } },
    );
    return ++this.currentID;
  }

  _getGenericTop(field, limit = 25) {
    return this.collection
      .find({})
      .sort({
        [field]: -1,
      })
      .limit(limit)
      .toArray();
  }
}

module.exports = BaseCollection;
