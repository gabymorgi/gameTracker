import { CustomHandler } from "../../types";

interface Params {
  startDate: string;
  endDate: string;
}

const aggregatesHandler: CustomHandler = async (prisma, params: Params) => {
  const playedTime = await prisma.$queryRaw`
    SELECT 
      to_char("createdAt", 'YYYY-MM') AS month_year,
      SUM("hours") AS hours,
      SUM("achievements") AS achievements
    FROM "ChangeLog"
    WHERE "createdAt" BETWEEN
      ${new Date(params.startDate)} AND
      ${new Date(params.endDate)}
    GROUP BY month_year
    ORDER BY month_year;
  `;

  const states = await prisma.$queryRaw`
    WITH LatestChangeLogs AS (
      SELECT DISTINCT ON ("gameId") *
      FROM "ChangeLog"
      WHERE "createdAt" BETWEEN ${new Date(params.startDate)} AND ${new Date(
        params.endDate,
      )}
      ORDER BY "gameId", "createdAt" DESC
    )
    SELECT "state", COUNT(*)
    FROM LatestChangeLogs
    GROUP BY "state";
  `;

  const tags = await prisma.$queryRaw`
    SELECT gt."tagId", SUM(cl."hours") as total_hours
    FROM "ChangeLog" cl
    JOIN "GameTag" gt ON cl."gameId" = gt."gameId"
    WHERE cl."createdAt" BETWEEN ${new Date(params.startDate)} AND ${new Date(
      params.endDate,
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
