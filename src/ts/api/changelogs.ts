import { CreateParams, Paginable, UpdateParams } from './common'
import { Changelog as PrismaChangelog } from '#prisma-client'
import { Game } from './games'

export type Changelog = Omit<PrismaChangelog, 'gameId'>

export interface ChangelogsGetParams extends Paginable {
  from?: Date
  to?: Date
  gameId?: string
  name?: string
  /** Injected server-side by the route handler — never sent by the client */
  isAuthenticated?: boolean
}

export interface ChangelogGet extends PrismaChangelog {
  game: Pick<
    Game,
    | 'id'
    | 'name'
    | 'appid'
    | 'imageUrl'
    | 'state'
    | 'playedTime'
    | 'extraPlayedTime'
    | 'obtainedAchievements'
    | 'totalAchievements'
    | 'mark'
    | 'review'
    | 'tags'
  >
}

export type ChangelogCreateParams = CreateParams<PrismaChangelog>
export type ChangelogUpdateParams = UpdateParams<PrismaChangelog>
