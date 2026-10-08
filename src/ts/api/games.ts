import { CreateParams, Paginable, UpdateParams } from './common'
import {
  Game as PrismaGame,
  Changelog as PrismaChangelog,
  $Enums,
  Prisma,
} from '#prisma-browser-client'

export const gameWithChangelogsInclude = {
  changelogs: {
    select: {
      achievements: true,
      createdAt: true,
      playedTime: true,
      gameId: true,
      id: true,
      state: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  },
} satisfies Prisma.GameInclude

export type Game = PrismaGame
export type GameWithChangelogs = Prisma.GameGetPayload<{
  include: typeof gameWithChangelogsInclude
}>
export interface PrismaGameWithChangelogs extends PrismaGame {
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

export type GameUpdateParams = UpdateParams<PrismaGame>
export type GameCreateParams = CreateParams<PrismaGame>

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
    playedTime: number
    achievements: number
    month_year: string
  }>
}
