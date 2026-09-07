import { Prisma } from "#prisma-client";

export const selectChangelog = {
  id: true,
  createdAt: true,
  hours: true,
  achievements: true,
  state: true,
  gameId: true,
  game: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
      start: true,
      end: true,
      state: true,
      playedTime: true,
      extraPlayedTime: true,
      mark: true,
      obtainedAchievements: true,
      totalAchievements: true,
      platform: true,
      review: true,
      appid: true,
      ost: true,
      tags: true,
    },
  },
} satisfies Prisma.ChangelogSelect;
