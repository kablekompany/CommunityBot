import { Command, CommandParams, CommandFunction, CommandProps } from './BaseCommand';
import { Message, PermissionString, User, GuildMember } from 'discord.js';

export interface ModCommandProps extends CommandProps {
	/**
	 * The required permissions to run this mod command.
	 */
	permissions: PermissionString[];
	/**
	 * Wether this command requires hierarchy check or not.
	 */
	hierarchy: boolean;
}

export declare interface ModCommand extends Command {
	constructor: typeof ModCommand;
	props: ModCommandProps;
}

export class ModCommand extends Command {
	/**
	 * Constructor for all mod commands.
	 */
	public constructor(
		fn: CommandFunction,
		props: ModCommandProps
	) { super(fn, props); }

	/**
	 * The default options for this mod command.
	 */
	public get defaultProps(): Partial<ModCommandProps> {
		return {
			...super.defaultProps,
			permissions: [],
			hierarchy: false,
		};
	}

	/**
	 * Check the hierarchy.
	 */
	public static checkHierarchy(msg: Message, user: User | GuildMember) {
		const target = user instanceof User ? msg.guild.members.resolve(msg.author.id) : user;
		const getHighestPos = (member: GuildMember) => member.roles.highest.position;
		return getHighestPos(msg.member) > getHighestPos(target); 
	}
}