import { Client, ClientOptions, Collection } from 'discord.js';
import { readdirSync, PathLike } from 'fs';
import { join } from 'path';

import { Command } from './command/BaseCommand';
import { Handler } from './handler/BaseHandler';

/**
 * Global type overrides.
 */
declare global {
	/**
	 * Node.JS overrides.
	 */
	namespace NodeJS {
		/**
		 * The process environment.
		 */
		interface ProcessEnv {
			DISCORD_TOKEN: string;
		}
	}
}

export default class CommunityBot {
	/**
	 * The client instance.
	 */
	public bot: Client;
	/**
	 * The bot commands.
	 */
	public cmds: Collection<string, Command>;
	/**
	 * The bot config.
	 */
	public config: typeof import('../config')['default'];

	/**
	 * Constructor for this bot.
	 * @param token the client token
	 * @param options client options for discord.js
	 */
	public constructor(public token: string, options: ClientOptions) {
		this.bot = new Client(options);
		this.cmds = new Collection();
		this.config = require('../config').default;
	}

	/**
	 * Read a directory.
	 */
	private readSync(path: PathLike, fn: (file: string) => any): any[] {
		const ret: any[] = [];
		for (const file of readdirSync(path)) {
			ret.push(fn(file));
		}

		return ret;
	}

	/**
	 * Load all bot commands.
	 */
	public loadCommands() {
		return this.readSync(join(__dirname, '..', 'commands'), file => {
			const commands: Command[] = require(join(__dirname, '..', 'commands', file)).default;
			for (const command of commands) {
				this.cmds.set(command.props.name, command);
			}
		});
	}

	/**
	 * Load all listeners.
	 */
	public loadListeners() {
		return this.readSync(join(__dirname, '..', 'handlers'), file => {
			const listeners: Handler[] = require(join(__dirname, '..', 'handlers', file)).default;
			for (const listener of listeners) {
				this.bot.on(listener.props.event, listener.fn.bind(listener));
			}
		});
	}

	/**
	 * Connect to discord and load it's microtasks.
	 */
	async launch() {
		this.loadCommands();
		this.loadListeners();
		return this.bot.login(this.token);
	}
}