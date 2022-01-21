const BaseCollection = require('./BaseCollection');

class Polls extends BaseCollection {
  constructor(collection) {
    super(collection);
    this.default = {
      choices: {
        one: {
          choice: '',
          votes: 0
        }
      },
      voted: [],
      createdBy: '',
      createdAt: Date.now(),
      ended: false
    };
    this.leaderboardCache = {
      cachedAt: 0,
      data: []
    };
  }

  async addPoll(createdBy, question, choices, createdAt = Date.now()) {
    const latestID = await this.getIncrementingID();
    await this.collection.insertOne({
      _id: latestID,
      question,
      choices,
      voted: [],
      createdBy,
      createdAt,
      ended: false
    });
    return latestID;
  }

  async addVote(pollID, userID, choice) {
    this.inc(+pollID, `choices.${choice}.votes`, 1);
    return this.update(+pollID, {
      $addToSet: {
        voted: userID
      }
    });
  }

  async hasVoted(pollID, userID) {
    const { voted } = await this.get(+pollID);
    if (voted && voted.includes(userID)) {
      return true;
    }
    return false;
  }

  end(pollID) {
    return this.set(+pollID, 'ended', true);
  }
}

module.exports = Polls;
