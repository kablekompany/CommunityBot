const { Client, Collection, LimitedCollection } = require('discord.js');
const { join } = require('path');
const { readdirSync } = require('fs');
const Database = require('../../Database/index');

class BotModel {
  constructor(token) {
    this.token = token;
    this.cmds = [];
    this.bot = new Client({
      makeCache: (manager) => {
        if (manager.name === 'MessageManager') {
          return new LimitedCollection({ maxSize: 250 });
        }
        return new Collection();
      },
      intents: 5711,
    });
    this.config = require('../../configs/config.json');
    this.utils = {};
    this.db = new Database();
  }

  loadCommands() {
    const categories = readdirSync(join(__dirname, '..', '..', 'commands'));

    for (const category of categories) {
      const commands = require(join(
        __dirname,
        '..',
        '..',
        'commands',
        category,
      ));

      for (const command of commands) {
        this.cmds.push(command);
      }
    }
  }

  loadListeners() {
    const listeners = require(join(__dirname, '..', '..', 'events'));

    for (const listener of listeners) {
      const fnListener = require(join(
        __dirname,
        '..',
        '..',
        'events',
        listener,
      ));

      const boundListener = fnListener.bind(this);
      this.bot.on(listener, boundListener);
    }
  }

  loadUtils() {
    const utils = require(join(__dirname, '..', '..', 'utils'));
    for (const util of utils) {
      Object.assign(this.utils, util);
    }
  }

  async launch() {
    await this.db.bootstrap(this.config);
    this.loadCommands();
    this.loadListeners();
    this.loadUtils();
    this.bot.login(this.token);
  }
}

module.exports = BotModel;
