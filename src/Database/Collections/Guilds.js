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
    return this.set(id, 'prefix', prefix);
  }
}

module.exports = Guilds;
