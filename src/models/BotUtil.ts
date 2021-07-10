import { GuildMember, GuildChannel, PermissionResolvable, User, Message } from 'discord.js';
import colors from '../../assets/colours.json';
import Bot from './Client';

export class BotUtil {
	/**
	 * Construct this bot utility.
	 * @param bot the community bot instance
	 */
	public constructor(public bot: Bot) {}

	/**
	 * Check if the member has the permissions in the channel.
	 * @param member the member to be checked
	 * @param channel the guild channel to check for
	 * @param perms array of permission bits or strings
	 */
	checkUserPerms = (member: GuildMember, channel: GuildChannel, perms: PermissionResolvable) => {
		return member.permissionsIn(channel).has(perms);
	};

	/**
	 * Check if the member's highest role is higher than the target's highest role.
	 * @param member the context member
	 * @param target the user to compare
	 */
	checkHierarchy = (member: GuildMember, target: GuildMember) => {
		return member.roles.highest.position > target.roles.highest.position;
	};

	/**
	 * Check wether the author is the context guild owner.
	 * @param msg the discord.js message instance
	 */
	isGuildOwner = (msg: Message) => msg.guild.ownerId === msg.author.id;

	/**
	 * Check wether the user is one of the bot owners.
	 * @param config the config of this bot
	 * @param user the user to be checked for
	 */
	isBotOwner = (config: Bot['config'], user: User) => config.owners.includes(user.id);

	/**
	 * Parse a date object to a readable date.
	 * @param date the date instance
	 */
	parseDate = (date: Date) => date.toLocaleString('utc', {
		hour: 'numeric',
		minute: 'numeric',
		weekday: 'long',
		day: 'numeric',
		year: 'numeric',
		month: 'long',
	});

	/**
	 * Parse the time to short readables.
	 * @param time the time in seconds
	 */
	parseTime = (time: number) => {
		const methods = [
			{ name: 'd', count: 86400 },
			{ name: 'h', count: 3600 },
			{ name: 'm', count: 60 },
			{ name: 's', count: 1 },
		];

		const timeStr = [
			Math.floor(time / methods[0].count).toString() + methods[0].name,
		];
		for (let i = 0; i < 3; i++) {
			timeStr.push(
				Math.floor(
					(time % methods[i].count) / methods[i + 1].count,
				).toString() + methods[i + 1].name,
			);
		}

		return timeStr.filter((t) => !t.startsWith('0')).join(' ');
	}

	/**
	 * Random item from the array
	 * @param array the array to get the random item from.
	 */
	randomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

	/**
	 * Generate a random color from daunt's epic color list.
	 */
	randomColour = () => Number(this.randomItem(colors).replace('#', '0x'));

	/**
	 * Transform something to a codeblock.
	 * @param msg could be anything
	 * @param language the syntax highlighting
	 */
	codeblock = (msg: any, language = '') => `${'```'}${language}\n${msg}${'```'}`;

	/**
	 * Daunt's pretty date parser making me think im from the future.
	 */
	prettyDate = () => {
		const date = new Date(Date.now() - 1.44e7); // UTC to UTC -4
		const times = [date.getHours(), date.getMinutes(), date.getSeconds()];
		const formattedDate = `${times
			.map((t) => t.toString().padStart(2, '0'))
			.join(':')} — ${date.toLocaleDateString()}`;
		return formattedDate;
	}
}