const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = readdirSync(__dirname)
  .filter((f) => f !== 'index.js' && f !== 'cmdTracker.js')
  .map((f) => require(join(__dirname, f)));
