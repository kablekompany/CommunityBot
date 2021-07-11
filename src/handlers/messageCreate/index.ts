import { MessageHandler } from '../../models/handler/MessageHandler';
import { Handler } from '../../models/handler/BaseHandler';
import { Message } from 'discord.js';

import MessageHandlers from './handlers';

export default new Handler<'messageCreate'>(
	async function(msg: Message) {
		for (const handler of MessageHandlers as MessageHandler[]) {
			handler.execute(msg, this);
		}
	}, {
	event: 'messageCreate'	
});