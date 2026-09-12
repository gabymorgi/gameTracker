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
      state: true,
      mark: true,
      playedTime: true,
      extraPlayedTime: true,
      obtainedAchievements: true,
      totalAchievements: true,
      review: true,
      appid: true,
      tags: true,
    },
  },
} satisfies Prisma.ChangelogSelect;
