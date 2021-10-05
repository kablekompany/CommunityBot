export const config: Config = {
  prefix: 'd!',
  applicationID: '',
  mongoURI: 'mongodb://localhost/CommunityBot',
  dmc: {
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
  },
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

type LogType = 'boot' | 'dm';

export interface Config {
  prefix: string;
  applicationID?: string;
  mongoURI: string;
  logs: Record<`${LogType}Log`, LogConfig>;
  dmc: DMCConfig;
}

interface LogConfig {
  enabled: boolean;
  channel: string;
}

interface DMCConfig {
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