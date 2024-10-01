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
  states: Array<{
    state: GameState;
    count: number;
  }>;
  tags: Array<{
    tagId: string;
    total_hours: number;
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

  const states: GameAggregateResponse["states"] = await prisma.$queryRaw`
    WITH LatestChangelogs AS (
      SELECT DISTINCT ON ("gameId") *
      FROM "Changelog"
      WHERE "createdAt" BETWEEN ${new Date(params.from)} AND ${new Date(
        params.to,
      )}
      ORDER BY "gameId", "createdAt" DESC
    )
    SELECT "state", COUNT(*)
    FROM LatestChangelogs
    GROUP BY "state";
  `;

  const tags: GameAggregateResponse["tags"] = await prisma.$queryRaw`
    SELECT gt."tagId", SUM(cl."hours") as total_hours
    FROM "Changelog" cl
    JOIN "GameTag" gt ON cl."gameId" = gt."gameId"
    WHERE cl."createdAt" BETWEEN ${new Date(params.from)} AND ${new Date(
      params.to,
    )}
    GROUP BY gt."tagId"
    ORDER BY total_hours DESC
    LIMIT 10;
  `;

  return {
    playedTime,
    states,
    tags,
  };
};

export default {
  path: "aggregates",
  handler: aggregatesHandler,
  needsAuth: false,
};
