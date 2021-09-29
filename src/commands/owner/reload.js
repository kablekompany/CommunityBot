/* eslint-disable no-restricted-syntax */
const { join } = require('path');
const { Collection } = require('discord.js');
const OwnerCommand = require('../../models/Command/OwnerCommand');
const config = require('../../configs/config.json');

module.exports = new OwnerCommand(
  async ({ ctx, args }) => {
    const toReload = args[0].toLowerCase();
    if (toReload === 'cmds') {
      for (const path in require.cache) {
        if (path.includes(join('src', 'commands'))) {
          delete require.cache[path];
        }
      }
      ctx.cmds = new Collection();
      ctx.loadCommands();
      return 'Reloaded all commands';
    }
    if (toReload === 'events') {
      delete ctx.bot._events;
      for (const path in require.cache) {
        if (path.includes(join('src', 'events'))) {
          delete require.cache[path];
        }
      }
      ctx.loadListeners();
      return 'Reloaded all event handlers';
    }
    if (toReload === 'config') {
      for (const path in require.cache) {
        if (path.includes(join('src', 'config'))) {
          delete require.cache[path];
        }
      }
      ctx.config = config;
      return 'Reloaded the config';
    }
    if (toReload === 'all') {
      for (const path in require.cache) {
        if (
          path.includes(join('src', 'configs')) ||
          path.includes(join('src', 'commands')) ||
          path.includes(join('src', 'events')) ||
          path.includes(join('src', 'utils')) ||
          path.includes(join('src', 'slashCommands'))
        ) {
          delete require.cache[path];
        }
      }
      delete ctx.bot._events;
      ctx.loadListeners();

      ctx.cmds = new Collection();
      ctx.loadCommands();

      ctx.utils = {};
      ctx.loadUtils();

      ctx.config = config;
      return 'Reloaded everything, good luck';
    }
    return 'Not a valid option';
  },
  {
    name: 'reload',
    usage: 'reload cmds/events/config/all',
    argReq: true,
    minArgs: 1,
    responses: {
      noArg: 'What do you want to reload? `cmds|events|config|all`',
    },
  },
);
