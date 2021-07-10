import { MessageOptions, Message, Role, Snowflake, User, Collection, GuildMember, TextChannel } from 'discord.js';
import Bot from '../Client';

const pingMatch = /<?(@!?)?(\d{15,21})>?/g;
const tagMatch = /.+#\d{4}/g;

/**
 * Function to run this command.
 * @param args the command parameters
 */
export type CommandFunction = (args: CommandParams) => string | MessageOptions;

export class Command {
	/**
	 * The command function.
	 */
	public fn: CommandFunction;
	/**
	 * The command options.
	 */
	public props: CommandProps;
	/**
	 * The constructor (just for static methods/props typings) 
	 */
	public ['constructor']: typeof Command;

	/**
	 * Constructor for all commands.
	 * @param fn the command function
	 * @param props the command options
	 */
	public constructor(fn: CommandFunction, props: CommandProps) {
		/** @type {CommandProps} */
		this.props = Object.assign(this.defaultProps, props);
		/** @type {CommandFunction} */
		this.fn = fn.bind(this);
	}

	/**
	 * The default command options.
	 */
	private get defaultProps(): Partial<CommandProps> {
		return {
			aliases: [],
			usage: '<command>',
			ownerOnly: false,
			adminOnly: false,
			reqArgs: false,
			minArgs: 0,
			responses: {
        noArgs: 'You need to put in some args!',
        missingArgs: 'Not enough args!',
      },
      development: false,
		};
	}

	/**
	 * The name and aliases of this command.
	 */
	public get triggers(): string[] {
		return [this.props.name, ...this.props.aliases];
	}

	/**
	 * Check if the author is blocked by this command.
	 */
	private checkMessage({ args, ctx, msg, cleanArgs }: CommandParams): string | boolean {
		const hasRole = (r: string | Snowflake) => msg.member.roles.cache.has(r as Snowflake);
		if (this.props.development) return false;
		if (this.props.adminOnly && !hasRole(ctx.config.dmc.adminRole)) return false;
		if (this.props.reqArgs) {
			if (args.length === 0) return this.props.responses.noArgs;
			if (args.length < this.props.minArgs) return this.props.responses.missingArgs;
		}

		return true;
	}

	/**
	 * Run this command.
	 */
	public async execute({ args, ctx, msg, cleanArgs }: CommandParams): Promise<ReturnType<CommandFunction>> {
		const check = this.checkMessage({ args, ctx, msg, cleanArgs });
		if (!check) return null;
		if (typeof check === 'string') return check;

		try {
			const ret = await this.fn({ args, ctx, msg, cleanArgs });
			return ret;
		} catch(e) {
			return `An error occured :(\n${e.message}`;
		}
	}

	/**
	 * Resolve a user client-wise.
	 */
	public static resolveUser(ctx: Bot, user: string) {
		const users = ctx.bot.users.cache;
		let possibleUser: User;

		const result = user.match(pingMatch) || user.match(tagMatch);
		if (user.match(pingMatch)) {
			user = result.shift();
			user = user.replace(/<@!?/g, '').replace(/>/g, '');
      possibleUser = users.get(user as Snowflake);
		}
		if (user.match(tagMatch)) {
			user = result.shift();
			possibleUser = users.find(u => u.tag === user);
		}

		return possibleUser;
	}

	/**
	 * Resolve a user guild-wise.
	 */
	public resolveMember(msg: Message, member: string) {
		const members = msg.guild.members.cache;
		let possibleMember: GuildMember;msg
		const result =
      member.match(pingMatch) || member.match(tagMatch);
    if (member.match(pingMatch)) {
      member = result.shift();
      member = member.replace(/<@!?/g, '').replace('>', '');
      possibleMember = members.get(member as Snowflake);
    }

    if (member.match(tagMatch)) {
      member = result.shift();
      possibleMember = members.find(m => m.user.tag === member);
    } else {
      possibleMember = members.find(m => m.nickname === member);
    }

    return possibleMember;
	}

	/**
	 * Resolve a channel form the guild.
	 */
	public static resolveChannel(msg: Message, channel: string) {
		const channels = msg.guild.channels.cache as Collection<Snowflake, TextChannel>;
		let possibleChannel: TextChannel;

		const result = channel.match(/<?(@!?)?(\d{15,21})>?/g);
    if (channel.match(/(<#)?\d{15,21}>?/g)) {
      channel = result.shift();
      channel = channel.replace('<#', '').replace('>', '');
      possibleChannel = channels.get(channel as Snowflake);
    } else {
      possibleChannel = channels.find((c) => c.name === channel);
    }
    return possibleChannel;
	}

	/**
	 * Resolve a role from the guild.
	 */
	public static resolveRole(msg: Message, role: string) {
		const roles = msg.guild.roles.cache;
		let possibleRole: Role;

		const result = role.match(/<?(@!?)?(\d{15,21})>?/g);
    if (role.match(/(<@&)?\d{15,21}>?/g)) {
      role = result.shift();
      role = role.replace(/<@&/g, '').replace(/>/g, '');
      possibleRole = roles.get(role as Snowflake);
    } else {
      possibleRole = roles.find((r) => r.name === role);
    }

    return possibleRole;
	}
}

export interface CommandParams {
	/**
	 * The command arguments.
	 */
	args: string[];
	/**
	 * The bot instance.
	 */
	ctx: Bot;
	/**
	 * Sanitized arguments.
	 */
	cleanArgs?: string[];
	/**
	 * The discord message.
	 */
	msg: Message;
}

export interface CommandProps {
	/**
	 * The name of this command.
	 */
	name: string;
	/**
	 * The command triggers.
	 */
	aliases: string[];
	/**
	 * The usage of the command.
	 */
	usage?: string;
	/**
	 * Wether this command is limited to bot owners only.
	 */
	ownerOnly?: boolean;
	/**
	 * Wether this is only limited for server admins only.
	 */
	adminOnly?: boolean;
	/**
	 * Wether this command requires arguments.
	 */
	reqArgs?: boolean;
	/**
	 * The minimum amount of arguments to pass.
	 */
	minArgs?: number;
	/**
	 * The responses for arguments.
	 */
	responses: {
		/**
		 * Response if no args were passed.
		 */
		noArgs?: string;
		/**
		 * Response if there were missing args.
		 */
		missingArgs?: string;
	};
	// argType: any[];
	/**
	 * Wether this command is available for prod.
	 */
	development?: boolean;
}