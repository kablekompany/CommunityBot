const BaseCollection = require('./BaseCollection');

class Users extends BaseCollection {
	constructor(collection) {
		super(collection);
		this.default = {
			infractions: [],
			infractionCount: 0
		};
		this.infractionsCache = {
			cachedAt: 0,
			data: []
		};
	}

	async initUser(id) {
		const createdUser = await this.collection.insertOne({
			_id: id
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
				infractionCount: 1
			},
			$push: { infractions: { $each: [msgLink], $slice: -5 } }
		});
	}

	async getTopInfractions(forced = false) {
		let cache = this.infractionsCache;
		if (Date.now() - cache.cachedAt > 5 * 60 * 1000 || forced) {
			const topInfractions = await this._getGenericTop('infractionCount');
			cache = {
				data: topInfractions,
				cachedAt: Date.now()
			};
		}

		return cache.data;
	}
}

module.exports = Users;
