const BaseCollection = require('./BaseCollection');

class Automod extends BaseCollection {
  constructor(collection) {
    super(collection);
    this.default = {
      cases: 0,
      censors: [],
      whitelistedRoles: [],
      whitelistedChannels: [],
    };
    this.cache = {
      cachedAt: 0,
      censors: [],
    };
  }
}

module.exports = Automod;
