import { Prisma } from "@prisma/client";

export const selectChangelog: Prisma.ChangelogSelect = {
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
      playedTime: true,
      extraPlayedTime: true,
      mark: true,
      obtainedAchievements: true,
      totalAchievements: true,
      platform: true,
      review: true,
      appid: true,
      gameTags: {
        select: {
          tagId: true,
        },
      },
    },
  },
};
