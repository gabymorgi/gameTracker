import { GameState } from '@/ts/api'

export interface GameI {
  id: string
  appid?: number
  name: string
  start: Date
  end: Date
  tags: Array<string>
  state: GameState
  playedTime: number
  extraPlayedTime?: number
  mark: number
  review?: string
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
  | 'state'
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
  state: string
  gameId: string
  game: {
    name: GameI['name']
    imageUrl: GameI['imageUrl']
  }
}
