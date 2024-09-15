import { Tags } from "@prisma/client";

type Achievements = {
  obtained: number;
  total: number;
};

interface PrismaGame {
  obtainedAchievements: number;
  totalAchievements: number;
  tags?: Tags[];
}

type FormattedGame<T> = Omit<
  T,
  "obtainedAchievements" | "totalAchievements"
> & {
  achievements: Achievements;
  tags: string[];
};

export function formatGame<T extends PrismaGame>(game: T): FormattedGame<T> {
  const { obtainedAchievements, totalAchievements, ...rest } = game;

  return {
    ...rest,
    tags: game.tags?.map((tag) => tag.id) || [],
    achievements: {
      obtained: obtainedAchievements,
      total: totalAchievements,
    },
  };
}
