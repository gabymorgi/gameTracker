import { GameTag } from "@prisma/client";

type Achievements = {
  obtained: number;
  total: number;
};

interface PrismaGame {
  obtainedAchievements: number;
  totalAchievements: number;
  gameTags?: GameTag[];
}

type FormattedGame<T> = Omit<
  T,
  "obtainedAchievements" | "totalAchievements" | "gameTags"
> & {
  achievements: Achievements;
  tags: string[];
};

export function formatGame<T extends PrismaGame>(game: T): FormattedGame<T> {
  const { obtainedAchievements, totalAchievements, gameTags, ...rest } = game;

  return {
    ...rest,
    tags: gameTags?.map((tag) => tag.tagId) || [],
    achievements: {
      obtained: obtainedAchievements,
      total: totalAchievements,
    },
  };
}
