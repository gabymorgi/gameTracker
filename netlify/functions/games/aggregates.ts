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

interface GameAggregateResponse {
  playedTime: Array<{
    hours: number;
    achievements: number;
    month_year: string;
  }>;
}

const aggregatesHandler: CustomHandler<"games/aggregates"> = async (
  prisma,
  params,
) => {
  const playedTime: GameAggregateResponse["playedTime"] =
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
  path: "aggregates",
  handler: aggregatesHandler,
  needsAuth: false,
};
