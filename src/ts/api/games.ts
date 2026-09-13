import { CreateParams, Paginable, UpdateParams } from './common'
import {
  Game as PrismaGame,
  Changelog as PrismaChangelog,
  $Enums,
  Prisma,
} from '#prisma-browser-client'

export const gameWithChangelogsSelect = {
  id: true,
  appid: true,
  name: true,
  imageUrl: true,
  obtainedAchievements: true,
  totalAchievements: true,
  playedTime: true,
  extraPlayedTime: true,
  tags: true,
  changelogs: {
    select: {
      achievements: true,
      createdAt: true,
      hours: true,
      gameId: true,
      id: true,
      state: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  },
} satisfies Prisma.GameSelect

export type Game = PrismaGame
export type GameWithChangelogs = Prisma.GameGetPayload<{
  select: typeof gameWithChangelogsSelect
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
