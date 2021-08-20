// @ts-check
const { readdirSync } = require('fs');
const { join } = require('path');

class Reader {
	/**
	 * @param {string} dir
	 * @param {(file: string) => any} fn
	 * @returns {string[]}
	 */
	read(dir, fn) {
		/** @type {string[]} */
		const ret = [];
		for (const file of readdirSync(dir)) {
			ret.push(fn(file));
		}

		return ret;
	}
}

const r = new Reader();
const cmds = r.read(join(__dirname, 'commands'), cmd => { 
	const command = require(join(__dirname, 'commands', cmd));
	return command;
});

console.log({ cmds })