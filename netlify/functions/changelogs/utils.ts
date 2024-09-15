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
      name: true,
      imageUrl: true,
    },
  },
};
