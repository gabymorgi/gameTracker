import { CustomHandler } from "../../types";

// remove the import statement for formatGame
export const gameState = {
  ACHIEVEMENTS: "ACHIEVEMENTS",
  BANNED: "BANNED",
  COMPLETED: "COMPLETED",
  DROPPED: "DROPPED",
  PLAYING: "PLAYING",
  WON: "WON",
};

export type GameState = keyof typeof gameState;

interface GameStatisticsResponse {
  playedTime: Array<{
    hours: number;
    achievements: number;
    month_year: string;
  }>;
}

const statisticsHandler: CustomHandler<"games/statistics"> = async (
  prisma,
  params,
) => {
  const playedTime: GameStatisticsResponse["playedTime"] =
    await prisma.$queryRaw`
    SELECT 
      to_char("createdAt", 'YYYY-MM') AS month_year,
      SUM("hours") AS hours,
      SUM("achievements") AS achievements
    FROM "Changelog"
    WHERE "createdAt" BETWEEN
      ${new Date(params.from)} AND
      ${new Date(params.to)}
    GROUP BY month_year
    ORDER BY month_year;
  `;

  return {
    playedTime,
  };
};

export default {
  path: "statistics",
  handler: statisticsHandler,
  needsAuth: false,
};
