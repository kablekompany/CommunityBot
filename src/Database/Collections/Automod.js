const BaseCollection = require('./BaseCollection');

const idMatcherRegex = /^([0-9]{15,21})$/;

class Automod extends BaseCollection {
  constructor(collection) {
    super(collection);
    this.default = {
      censors: [],
      whitelistedRoles: [],
      whitelistedChannels: [],
    };
    this.cache = {
      cachedAt: 0,
      censors: [],
    };
  }

  async genericAdd(guildID, entity, type) {
    const types = ['channel', 'role', 'censor'];
    if (type !== 'censor' && !entity.match(idMatcherRegex)) {
      throw new Error('entity must be a Snowflake');
    }
    if (!types.includes(type)) {
      throw new TypeError('Invalid "type" specified.');
    }
    let query = {};
    if (type === 'role') {
      query = {
        $addToSet: {
          whitelistedRoles: entity,
        },
      };
    } else if (type === 'censor') {
      query = {
        $addToSet: {
          censors: entity,
        },
      };
    } else if (type === 'channel') {
      query = {
        $addToSet: {
          whitelistedChannels: entity,
        },
      };
    }
    return this.update(guildID, query);
  }

  async genericRemove(guildID, entity, type) {
    const types = ['channel', 'role', 'censor'];
    if (type !== 'censor' && !entity.match(idMatcherRegex)) {
      throw new Error('entity must be a Snowflake');
    }
    if (!types.includes(type)) {
      throw new TypeError('Invalid "type" specified.');
    }
    let query = {};
    if (type === 'role') {
      query = {
        $pull: {
          whitelistedRoles: entity,
        },
      };
    } else if (type === 'censor') {
      query = {
        $pull: {
          censors: entity,
        },
      };
    } else if (type === 'channel') {
      query = {
        $pull: {
          whitelistedChannels: entity,
        },
      };
    }
    return this.update(guildID, query);
  }
}

module.exports = Automod;
