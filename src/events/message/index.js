const messageHandlers = require('./handlers');

async function onMsg(msg) {
  for (const handler of messageHandlers) {
    handler.execute({ ctx: this, msg });
  }
}

module.exports = onMsg;
