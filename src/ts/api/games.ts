import { BatchPayload, CreateParams, Paginable, UpdateParams } from './common'

export const platform = {
  NES: 'NES',
  SEGA: 'SEGA',
  PS1: 'PS1',
  PS2: 'PS2',
  SNES: 'SNES',
  PC: 'PC',
  NDS: 'NDS',
  GBA: 'GBA',
  WII: 'WII',
  ANDROID: 'ANDROID',
  FLASH: 'FLASH',
}
type Platform = keyof typeof platform

export const gameState = {
  ACHIEVEMENTS: 'ACHIEVEMENTS',
  BANNED: 'BANNED',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED',
  PLAYING: 'PLAYING',
  WON: 'WON',
}
export type GameState = keyof typeof gameState

export interface GameTag {
  gameId: string
  tagId: string
}

export interface Tag {
  id: string
  hue: number
}

export interface Game {
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

export interface GameWithChangelogs extends Game {
  changelogs: Array<{
    id: string
    createdAt: Date
    hours: number
    achievements: number
    state: GameState
    gameId: string
  }>
}

export interface GameGetParams extends Paginable {
  gameId?: string
  name?: string
  start?: Date
  end?: Date
  state?: string
  tags?: string[]
}

export type GameUpdateInput = UpdateParams<GameWithChangelogs>
export type GameCreateInput = CreateParams<GameWithChangelogs>

export interface GameAggregateParams {
  from: Date
  to: Date
}

export interface GameAggregateResponse {
  playedTime: Array<{
    hours: number
    achievements: number
    month_year: string
    sum: number
  }>
  states: Array<{
    state: GameState
    count: number
  }>
  tags: Array<{
    tagId: string
    total_hours: number
  }>
}

export type GameSearchResponse = Pick<Game, 'id' | 'name' | 'imageUrl'>

export interface GameDropResponse {
  updateGames: BatchPayload
  updatedChangelog: BatchPayload
}
