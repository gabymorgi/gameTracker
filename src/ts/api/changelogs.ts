import { CreateParams, Paginable, UpdateParams } from './common'

export type ChangelogState =
  | 'ACHIEVEMENTS'
  | 'BANNED'
  | 'COMPLETED'
  | 'DROPPED'
  | 'PLAYING'
  | 'WON'

export interface ChangelogsGetParams extends Paginable {
  from?: Date
  to?: Date
  gameId?: string
}

export interface Changelog {
  id: string
  createdAt: Date
  hours: number
  achievements: number
  state: ChangelogState
  gameId: string
  game: {
    name: string
    imageUrl: string
  }
}

export type ChangelogCreateInput = CreateParams<Omit<Changelog, 'game'>>
export type ChangelogUpdateInput = UpdateParams<Omit<Changelog, 'game'>>

export interface ChangelogsGetGamesParams extends Paginable {
  gameId?: string
  name?: string
  start?: Date
  end?: Date
  state?: string
  tags?: string[]
  appids?: number[]
}

export interface ChangelogsGame {
  id: string
  appid: number
  name: string
  playedTime: number
  extraPlayedTime?: number
  imageUrl: string
  achievements: {
    obtained: number
    total: number
  }
  changeLogs: Array<{
    id: string
    state: ChangelogState
    createdAt: Date
    hours: number
    achievements: number
    gameId: string
  }>
}
