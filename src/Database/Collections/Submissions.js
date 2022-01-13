const BaseCollection = require('./BaseCollection');

class Submissions extends BaseCollection {
  constructor(collection) {
    super(collection);
    this.default = {
      _id: 0,
      userID: '',
      link: '',
      upvotes: [],
      downvotes: [],
      createdAt: 0
    };
    this.leaderboardCache = {
      cachedAt: 0,
      data: []
    };
  }

  async addSubmission(userID, link, createdAt = Date.now()) {
    const latestID = await this.getIncrementingID();
    await this.collection.insertOne({
      _id: latestID,
      userID,
      link,
      upvotes: [],
      downvotes: [],
      createdAt
    });
    return latestID;
  }

  async addVote(submissionID, userID, type) {
    await this.update(+submissionID, {
      $addToSet: {
        [`${type}`]: userID
      }
    });
  }

  async hasVoted(userID, submissionID) {
    const submission = await this.get(+submissionID);
    const votes = submission.upvotes.concat(submission.downvotes);
    if (votes.includes(userID)) {
      return true;
    }
    return false;
  }

  async getVotes(submissionID) {
    const { upvotes, downvotes } = await this.get(+submissionID);

    return {
      upvotes: upvotes.length,
      downvotes: downvotes.length
    };
  }

  async getLeaderboards(forced = false, type = 'upvotes', limit = 10) {
    let cache = this.leaderboardCache;
    if (Date.now() - cache.cachedAt > 5 * 60 * 1000 || forced) {
      const leaderboards = await this._getGenericTop(type, limit);
      cache = {
        data: leaderboards,
        cachedAt: Date.now()
      };
    }
    return cache.data;
  }
}

module.exports = Submissions;
