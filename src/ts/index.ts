// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericObject = { [key: string]: any }
export type Error = { message: string }

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
  gameTags: Array<{ tagId: string }>
  stateId: string
  end: number
  playedTime: number
  extraPlayedTime?: number
  score?: ScoreI
  imageUrl?: string
  obtainedAchievements: number
  totalAchievements: number
  platform: string
}

export interface FormGameI {
  id: string
  appid?: number
  name: string
  start: number
  end: number
  tags: Array<string>
  stateId: string
  playedTime: number
  extraPlayedTime?: number
  score?: ScoreI
  imageUrl?: string
  achievements: {
    obtained: number
    total: number
  }
  platform: string
  changeLogs?: Array<{
    id?: string
    achievements: number
    createdAt: number
    hours: number
    stateId: string
  }>
}

export interface AggregateI {
  playedTime: Array<{
    hours: number
    achievements: number
    month_year: string
    sum: number
  }>
  states: Array<{
    stateId: string
    count: number
  }>
  tags: Array<{
    tagId: string
    total_hours: number
  }>
}

export interface ChangelogI {
  id: string
  achievements: number
  createdAt: number
  gameId: string
  game: {
    name: string
    imageUrl: string
  }
  hours: number
  stateId: string
}

export interface GameChangelogI {
  id: string
  name: string
  imageUrl: string
  playedTime: number
  extraPlayedTime?: number
  obtainedAchievements: number
  changeLogs: Array<{
    id: string
    achievements: number
    createdAt: number
    hours: number
    stateId: string
  }>
}

export interface GameTagI {
  id: string
  tagId: string
  gameId: string
}
