class BaseCollection {
  constructor(collection) {
    this.collection = collection;
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

  set(_id, field, amount) {
    return this.update(_id, {
      $set: {
        [field]: amount,
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
}

module.exports = BaseCollection;
