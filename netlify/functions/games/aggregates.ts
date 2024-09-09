import { CustomHandler } from "../../types";

interface PlayedTimeAggregate {
  hours: number;
  achievements: number;
  month_year: string;
  sum: number;
}

interface StatesAggregate {
  stateId: string;
  count: number;
}

interface TagsAggregate {
  tagId: string;
  total_hours: number;
}

const aggregatesHandler: CustomHandler<"games/aggregates"> = async (
  prisma,
  params,
) => {
  const playedTime: PlayedTimeAggregate[] = await prisma.$queryRaw`
    SELECT 
      to_char("createdAt", 'YYYY-MM') AS month_year,
      SUM("hours") AS hours,
      SUM("achievements") AS achievements
    FROM "ChangeLog"
    WHERE "createdAt" BETWEEN
      ${new Date(params.from)} AND
      ${new Date(params.to)}
    GROUP BY month_year
    ORDER BY month_year;
  `;

  const states: StatesAggregate[] = await prisma.$queryRaw`
    WITH LatestChangeLogs AS (
      SELECT DISTINCT ON ("gameId") *
      FROM "ChangeLog"
      WHERE "createdAt" BETWEEN ${new Date(params.from)} AND ${new Date(
        params.to,
      )}
      ORDER BY "gameId", "createdAt" DESC
    )
    SELECT "state", COUNT(*)
    FROM LatestChangeLogs
    GROUP BY "state";
  `;

  const tags: TagsAggregate[] = await prisma.$queryRaw`
    SELECT gt."tagId", SUM(cl."hours") as total_hours
    FROM "ChangeLog" cl
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
