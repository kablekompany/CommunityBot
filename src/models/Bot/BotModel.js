const {
	Client,
	Collection,
	LimitedCollection,
	Intents
} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { join } = require('path');
const { readdirSync } = require('fs');
const { schedule } = require('node-cron');
const {
	setApiKey,
	checkDomain,
	reportCaughtPhish,
	getDomainInfo
} = require('@sapphire/phisherman');
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
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_BANS,
				Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
				Intents.FLAGS.GUILD_WEBHOOKS,
				Intents.FLAGS.GUILD_INVITES,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.DIRECT_MESSAGES
			],
			allowedMentions: {
				repliedUser: false,
				parse: ['users']
			}
		});
		this.db = new Database();
		this.cmds = new Collection();
		this.bot.slashCmds = new Collection();
		this.phisherman = {
			checkDomain,
			getDomainInfo,
			reportCaughtPhish
		};
		this.config = require('../../configs/config.json');
		this.secrets = require('../../configs/secrets.json');
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
				category
			));

			for (const command of commands) {
				this.cmds.set(command._props.name, command);
			}
		}
	}

	async loadSlashCommands() {
		const commandFiles = readdirSync(
			join(__dirname, '..', '..', 'slashCommands')
		);

		for (const file of commandFiles) {
			const command = require(`../../slashCommands/${file}`);
			if (!command.name) {
				throw new Error(
					`The file "${file}" is missing a command name.`
				);
			}
			this.bot.slashCmds.set(command.name, command);
		}

		const commands = this.bot.slashCmds.map(({ _, ...data }) => data);
		const RestAPI = new REST({ version: '9' }).setToken(this.token);

		try {
			await RestAPI.put(
				Routes.applicationGuildCommands(
					this.config.applicationID,
					this.config.dmc.guildID
				),
				{
					body: commands
				}
			);
			this.utils.log('[REST] Reloaded guild slash commands.');
		} catch (error) {
			this.utils.log(`[REST Error] ${error.message}`);
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
				listener
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

	startCronJobs() {
		const roleColourChange = schedule('0 12 * * *', async () => {
			const guild = this.bot.guilds.cache.get(this.config.dmc.guildID);
			const randomColour = Math.floor(Math.random() * 0xffffff);
			await guild.roles.edit(this.config.dmc.randomColourRole, {
				color: randomColour
			});
			return guild.channels.resolve(this.config.dmc.adminCmds).send({
				embeds: [
					{
						title: 'Role Edited',
						description: `The colour of <@&${this.config.dmc.randomColourRole}> has been changed successfully.`,
						color: randomColour
					}
				]
			});
		});
		const cacheMembers = schedule('0 5 * * *', async () => {
			try {
				const { members, name } = this.bot.guilds.cache.get(
					this.config.dmc.guildID
				);
				await members.fetch();
				this.utils.log(`Successfully cached all members of ${name}`);
			} catch (err) {
				this.utils.log(
					`Error while fetching all members:\n${err.message}`
				);
			}
		});
		roleColourChange.start();
		cacheMembers.start();
		this.utils.log('Scheduled both cron jobs.');
	}

	async launch() {
		await this.db.bootstrap(this.secrets.mongo);
		this.loadListeners();
		this.loadCommands();
		this.loadUtils();
		this.startCronJobs();
		this.loadSlashCommands();
		setApiKey(this.secrets.phishermanApiKey);
		this.bot.login(this.token);
	}
}

module.exports = BotModel;
