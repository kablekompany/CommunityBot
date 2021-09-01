const BaseCollection = require('./BaseCollection');

class Guilds extends BaseCollection {
  constructor(collection) {
    super(collection);
    this.default = {
      prefix: '!',
      commands: 0,
    };
  }

  async initGuild(id) {
    const createdGuild = await this.collection.insertOne({
      _id: id,
      ...this.default,
    });
    return createdGuild;
  }

  async getGuild(id) {
    const guild = await this.get({ _id: id });
    if (!guild) {
      return this.initGuild(id);
    }
    return guild;
  }

  async updatePrefix(id, prefix) {
    const res = await this.update(id, { $set: { prefix } });
    return res.result;
  }
}

module.exports = Guilds;
