import { CreateParams, Paginable, UpdateParams } from './common'
import { Prisma, Changelog as PrismaChangelog } from '#prisma-browser-client'

export type Changelog = Omit<PrismaChangelog, 'gameId'>

export interface ChangelogsGetParams extends Paginable {
  from?: Date
  to?: Date
  gameId?: string
  name?: string
  /** Injected server-side by the route handler — never sent by the client */
  isAuthenticated?: boolean
}

export const changelogWithGameSelect = {
  achievements: true,
  createdAt: true,
  hours: true,
  gameId: true,
  id: true,
  state: true,
  game: {
    select: {
      id: true,
      appid: true,
      name: true,
      imageUrl: true,
      obtainedAchievements: true,
      totalAchievements: true,
      playedTime: true,
      extraPlayedTime: true,
      tags: true,
      state: true,
      mark: true,
      review: true,
    },
  },
} satisfies Prisma.ChangelogSelect

export type ChangelogWithGame = Prisma.ChangelogGetPayload<{
  select: typeof changelogWithGameSelect
}>

export type ChangelogCreateParams = CreateParams<PrismaChangelog>
export type ChangelogUpdateParams = UpdateParams<PrismaChangelog>
