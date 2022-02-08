const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = readdirSync(__dirname)
	.filter((l) => l !== 'index.js')
	.map((l) => require(join(__dirname, l)));
