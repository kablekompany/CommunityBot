import { Handler, HandlerProps, HandlerFunction } from './BaseHandler';
import { Message } from 'discord.js';
import Bot from '../Client';

export interface MessageHandler extends Handler<'messageCreate'> {
	/**
	 * The props for this message handler.
	 */
	props: MessageHandlerProps & HandlerProps<'messageCreate'>;
}

export class MessageHandler extends Handler<'messageCreate'> {
	/**
	 * Base constructor for all messageCreate listeners.
	 * @param fn the handler function
	 * @param props the options for this handler
	 */
	public constructor(fn: HandlerFunction<'messageCreate'>, props: MessageHandlerProps) {
		super(fn, { ...props, event: 'messageCreate' });
	}

	/**
	 * Get the args of the message content.
	 * @param msg the discord message
	 * @param prefix the command prefix
	 * @param separator the args separator
	 */
	public static argify(msg: Message, prefix: string, separator = / /g) {
		if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
		return msg.content.slice(prefix.length).split(separator).filter(a => a);
	}

	/**
	 * Run this handler.
	 * @param msg the discord message
	 * @param ctx the bot instance
	 */
	public execute(msg: Message, ctx: Bot): ReturnType<HandlerFunction<'messageCreate'>> {
		if (msg.channel.type === 'DM' && !this.props.allowDM) return null;
		if (msg.author.bot && !this.props.allowBot) return null;

		try {
			this.fn.bind(ctx)(msg);
		} catch(e) {
			console.error(e.stack);
		}
	}
}

export interface MessageHandlerProps extends Omit<HandlerProps<'messageCreate'>, 'event'> {
	/**
	 * The name of this handler.
	 */
	name: string;
	/**
	 * Wether to listen for messages from dms.
	 */
	allowDM: boolean;
	/**
	 * Wether to allow bots for this handler.
	 */
	allowBot: boolean;
}