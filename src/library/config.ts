interface Config {
  prefix: string;
  owners: string[];
  applicationID?: string;
  mongoURI: string;
  logs: Record<`${Config.Log.Types}Log`, Config.Log>;
  dmc: Config.DMC;
}

namespace Config {
  export interface DMC {
    modRole: string;
    trialMod: string;
    mutedRole: string;
    adminRole: string;
    memerID: string;
    sales: string;
    lottery: string;
    prestige: string;
    general: string;
    tradeItems: string;
    tradeBuying: string;
    tradeSelling: string;
    tradeCategory: string;
    memerCategory: string;
    dramaWatcher: string;
    modlog: string;
    eventParticipant: string;
  }

  export interface Log {
    enabled: boolean;
    channel: string;
  }
}

namespace Config.Log {
  export type Types = 'boot' | 'dm';
}

const dmcConfig: Config.DMC = {
  modRole: '',
  trialMod: '',
  mutedRole: '',
  adminRole: '',
  memerID: '',
  sales: '',
  lottery: '',
  prestige: '',
  general: '',
  tradeItems: '',
  tradeBuying: '',
  tradeSelling: '',
  tradeCategory: '',
  memerCategory: '',
  dramaWatcher: '',
  modlog: '',
  eventParticipant: '',
};

const config: Config = {
  prefix: 'd!',
  applicationID: '',
  owners: [''],
  mongoURI: 'mongodb://localhost/CommunityBot',
  dmc: dmcConfig,
  logs: {
    bootLog: {
      enabled: false,
      channel: '',
    },
    dmLog: {
      enabled: false,
      channel: '',
    },
  },
};

export { config, type Config };