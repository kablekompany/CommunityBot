import { Handler } from '../models/handler/BaseHandler';

export default new Handler<'ready'>(async function () {
	console.log(`${this.bot.user.tag} is now up and running.`);
	await this.bot.user.setActivity({ type: 'WATCHING', name: 'you' });
	await this.bot.user.setStatus('dnd');
	return null;
}, {
	event: 'ready'
});