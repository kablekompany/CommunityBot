const BaseCollection = require('./BaseCollection');

class Users extends BaseCollection {
  constructor(collection) {
    super(collection);
    this.default = {
      reminders: {},
      flags: 0,
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
}

module.exports = Users;
