const { Client, Collection, LimitedCollection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { join } = require('path');
const { readdirSync } = require('fs');
const { Player } = require('discord-player');
const { registerPlayerEvents } = require('../../utils/playerEventHandler');
const Database = require('../../Database/index');

class BotModel {
  constructor(token) {
    this.token = token;
    this.bot = new Client({
      makeCache: (manager) => {
        if (manager.name === 'MessageManager') {
          return new LimitedCollection({ maxSize: 250 });
        }
        return new Collection();
      },
      intents: 4847,
    });
    this.db = new Database();
    this.cmds = new Collection();
    this.bot.player = new Player(this.bot);
    this.bot.slashCmds = new Collection();
    this.config = require('../../configs/config.json');
    this.roles = require('../../../assets/communityRoles');
    this.utils = {};
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
        this.cmds.set(command._props.name, command);
      }
    }
  }

  async loadSlashCommands() {
    const commandFiles = readdirSync(
      join(__dirname, '..', '..', 'slashCommands'),
    );

    for (const file of commandFiles) {
      const command = require(`../../slashCommands/${file}`);
      if (!command.name) {
        throw new Error(`The file "${file}" is missing a command name.`);
      }
      this.bot.slashCmds.set(command.name, command);
    }

    const command = this.bot.slashCmds.map(({ _, ...data }) => data);
    const RestAPI = new REST({ version: '9' }).setToken(this.token);

    try {
      await RestAPI.put(
        Routes.applicationGuildCommands(
          this.config.applicationID,
          this.config.dmc.guildID,
        ),
        {
          body: command,
        },
      );

      return console.log('[REST] Reloaded guild slash commands.');
    } catch (error) {
      return console.error(`[REST Error] ${error.message}`);
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
    await this.loadSlashCommands();
    registerPlayerEvents(this.bot.player);
    this.loadCommands();
    this.loadListeners();
    this.loadUtils();
    this.bot.login(this.token);
  }
}

module.exports = BotModel;
