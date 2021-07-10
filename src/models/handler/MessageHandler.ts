import BaseHandler, { HandlerProps, HandlerFunction } from './BaseHandler';
import { Message } from 'discord.js';

export interface MessageHandler extends BaseHandler<'messageCreate'> {
	/**
	 * The props for this message handler.
	 */
	props: MessageHandlerProps;
}

export class MessageHandler extends BaseHandler<'messageCreate'> {
	/**
	 * Base constructor for all messageCreate listeners.
	 * @param fn the handler function
	 * @param props the options for this handler
	 */
	public constructor(fn: HandlerFunction<'messageCreate'>, props: MessageHandlerProps) {
		super(fn, props);
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
}

export interface MessageHandlerProps extends HandlerProps<'messageCreate'> {
	/**
	 * Wether to listen for messages from dms.
	 */
	allowDM: boolean;
	/**
	 * Wether to allow bots for this handler.
	 */
	allowBot: boolean;
}