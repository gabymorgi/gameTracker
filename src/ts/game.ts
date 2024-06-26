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
  start: Date
  end: Date
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
  changeLogs?: Array<Omit<ChangelogI, 'game' | 'gameId'>>
}

export type ChangelogsGameI = Omit<
  GameI,
  | 'changeLogs'
  | 'appid'
  | 'start'
  | 'end'
  | 'tags'
  | 'stateId'
  | 'score'
  | 'platform'
> & {
  changeLogs: Array<Omit<ChangelogI, 'game'>>
}

export interface ChangelogI {
  id: string
  createdAt: Date
  hours: number
  achievements: number
  stateId: string
  gameId: string
  game: {
    name: GameI['name']
    imageUrl: GameI['imageUrl']
  }
}
