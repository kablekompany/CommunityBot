import { CommunityBot } from '#dmc/client';

const dmc = new CommunityBot({ intents: 5711 });

await dmc.login();