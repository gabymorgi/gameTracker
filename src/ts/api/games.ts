import { CreateParams, Paginable, UpdateParams } from './common'
import {
  Game as PrismaGame,
  Changelog as PrismaChangelog,
  $Enums,
} from '#prisma-client'

export type Game = PrismaGame
export interface PrismaGameWithChangelogs extends PrismaGame {
  changelogs: PrismaChangelog[]
}

export interface GameWithChangelogs extends Pick<
  Game,
  | 'id'
  | 'appid'
  | 'name'
  | 'imageUrl'
  | 'obtainedAchievements'
  | 'totalAchievements'
  | 'playedTime'
  | 'extraPlayedTime'
  | 'tags'
> {
  changelogs: PrismaChangelog[]
}

export interface GameGetParams extends Paginable {
  gameId?: string
  name?: string
  start?: Date
  end?: Date
  state?: $Enums.GameState
  tags?: string[]
  appids?: number[]
}

export type GameTags = Pick<Game, 'id' | 'tags'>
export type GameOst = Pick<Game, 'id' | 'name' | 'imageUrl' | 'ost'>
export type GameSearch = Pick<Game, 'id' | 'name' | 'imageUrl'>
export type GamePending = Pick<
  Game,
  'id' | 'name' | 'imageUrl' | 'mark' | 'review'
>

export type GameUpdateParams = UpdateParams<PrismaGameWithChangelogs>
export type GameCreateParams = CreateParams<PrismaGameWithChangelogs>

export interface GameSearchParams {
  id?: string
  search?: string
}

export interface GameStatisticsParams {
  from: Date
  to: Date
}

export interface GameStatistics {
  playedTime: Array<{
    hours: number
    achievements: number
    month_year: string
  }>
}
