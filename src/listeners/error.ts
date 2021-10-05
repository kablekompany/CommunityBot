import type { ListenerOptions, Events } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({ name: 'error' })
export default class extends Listener<typeof Events.Error> {
	public async run(error: Error) {	
		console.error(error.stack ?? error);
		return null;
	}
} 