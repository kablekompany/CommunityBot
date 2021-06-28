const { readdirSync } = require('fs');

module.exports = readdirSync(__dirname)
  .filter((l) => l !== 'index.js')
  .map((l) => l.split('.')[0]);
