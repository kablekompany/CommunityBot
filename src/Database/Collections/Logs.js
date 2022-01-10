const BaseCollection = require('./BaseCollection');

class Logs extends BaseCollection {
  constructor(collection) {
    super(collection);
    this.default = {
      case: 0,
      userID: '',
      reason: '',
      moderator: {
        tag: '',
        id: '',
      },
      date: Date.now(),
    };
  }

  async add(userID, reason, moderator, duration = null, type = 'mute') {
    const latestID = await this.getIncrementingID();
    await this.collection.insertOne({
      case: latestID,
      userID,
      type,
      duration: ['mute', 'tempban'].includes(type) ? duration : null,
      reason,
      moderator: {
        tag: moderator.tag,
        id: moderator.id,
      },
      date: Date.now(),
    });
    return latestID;
  }

  async fetchAll(userID) {
    const allModlogs = await this.collection.find({ userID }).toArray();
    return allModlogs;
  }
}

module.exports = Logs;
