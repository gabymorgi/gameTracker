import { CreateParams, Paginable, UpdateParams } from './common'
import { GameState, Platform } from './games'

type ChangelogState =
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
  state?: ChangelogState
  tags?: string[]
  appids?: number[]
}

export interface ChangelogsGame {
  id: string
  appid: number | null
  name: string
  playedTime: number
  extraPlayedTime: number | null
  imageUrl: string
  achievements: {
    obtained: number
    total: number
  }
  changelogs: Array<{
    id: string
    state: ChangelogState
    createdAt: Date
    hours: number
    achievements: number
    gameId: string
  }>
}

export interface ChangelogWithGame {
  id: string
  createdAt: Date
  hours: number
  achievements: number
  state: ChangelogState
  gameId: string
  game: {
    id: string
    appid: number | null
    name: string
    state: GameState
    start: Date
    end: Date
    playedTime: number
    extraPlayedTime: number | null
    mark: number
    review: string | null
    imageUrl: string
    platform: Platform
    tags: string[]
    achievements: {
      obtained: number
      total: number
    }
  }
}

export interface BookChangelog {
  id: string
  createdAt: Date
  words: number
}

export interface BookChangelogsGetParams {
  bookId: string
}
