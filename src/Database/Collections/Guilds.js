const BaseCollection = require('./BaseCollection');

class Guilds extends BaseCollection {
	constructor(collection) {
		super(collection);
		this.default = {
			prefixes: ['d!'],
			commands: 0
		};
	}

	async initGuild(id) {
		const createdGuild = await this.collection.insertOne({
			_id: id,
			...this.default
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

	async addPrefix(id, prefix) {
		await this.update(id, {
			$addToSet: {
				prefixes: prefix
			}
		});
	}

	async removePrefix(id, prefix) {
		await this.update(id, {
			$pull: {
				prefixes: prefix
			}
		});
	}
}

module.exports = Guilds;
