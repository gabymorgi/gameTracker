export type GenericObject = { [key: string]: any }
export type Error = { message: string }

export enum EndPoint {
  GAMES = 'games',
  CHANGELOGS = 'changelogs',
  AGGREGATES = 'aggregates',
  GLOBAL = 'global',
  TAGS = 'tags',
  STATES = 'states',
}

export interface ExtraScoreI {
  bias: number
  info: string
}

export interface ScoreI {
  content?: number
  lore?: number
  mechanics?: number
  bosses?: number
  controls?: number
  music?: number
  graphics?: number
  extras: Array<ExtraScoreI>
  finalMark: number
}

export interface GameI {
  id: string
  appid?: number
  name: string
  start: number
  gameTags: Array<{ tagId: string}>
  stateId: string
  end: number
  playedTime: number
  extraPlayedTime?: number
  score?: ScoreI
  imageUrl?: string
  obtainedAchievements: number
  totalAchievements: number
}

export type CreatedGame = Omit<GameI, 'id'>

export interface FormGameI {
  id: string;
  appid?: number;
  name: string;
  start: number;
  end: number;
  tags: Array<string>;
  state: string;
  oldHours?: number;
  playedTime: number;
  extraPlayedTime?: number;
  score?: ScoreI;
  imageUrl?: string;
  achievements: [number, number];
}

export interface AggregateI {
  id: string
  achievements: number
  hours: number
  month: number
  states: { [key: string]: number }
  tags: { [key: string]: number }
}

export interface ChangelogI {
  id: string
  achievements: number
  createdAt: number
  gameId: string
  gameName: string
  hours: number
  state: string
}