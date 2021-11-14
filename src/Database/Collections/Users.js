const BaseCollection = require('./BaseCollection');

class Users extends BaseCollection {
  constructor(collection) {
    super(collection);
    this.default = {
      infractions: [],
      infractionCount: 0,
    };
  }

  async initUser(id) {
    const createdUser = await this.collection.insertOne({
      _id: id,
    });
    return createdUser.ops[0];
  }

  async getUser(id) {
    const user = await this.get({ _id: id });
    if (!user) {
      return this.initUser(id);
    }
    return user;
  }

  async addInfraction(id, msgLink) {
    // insert user in db if they're not already there
    await this.getUser(id);
    return this.update(id, {
      $inc: {
        infractionCount: 1,
      },
      $push: { infractions: { $each: [msgLink], $slice: -5 } },
    });
  }
}

module.exports = Users;
