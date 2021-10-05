import { CommunityBot } from '#dmc/client';
import { join } from 'path';

const dmc = new CommunityBot({ 
	baseUserDirectory: join(process.cwd(), 'src'),
	intents: 5711,
});

await dmc.login();