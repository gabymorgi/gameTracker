import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};

    const playedTime = await prisma.$queryRaw`
      SELECT 
        to_char(to_timestamp("createdAt"), 'YYYY-MM') AS month_year,
        SUM("hours") AS hours,
        SUM("achievements") AS achievements
      FROM "ChangeLog"
      WHERE "createdAt" BETWEEN
        ${Number(params.startDate)} AND
        ${Number(params.endDate)}
      GROUP BY month_year
      ORDER BY month_year;
    `;

    const states = await prisma.$queryRaw`
      WITH LatestChangeLogs AS (
        SELECT DISTINCT ON ("gameId") *
        FROM "ChangeLog"
        WHERE "createdAt" BETWEEN ${Number(params.startDate)} AND ${Number(
          params.endDate,
        )}
        ORDER BY "gameId", "createdAt" DESC
      )
      SELECT "stateId", COUNT(*)
      FROM LatestChangeLogs
      GROUP BY "stateId";
    `;

    const tags = await prisma.$queryRaw`
      SELECT gt."tagId", SUM(cl."hours") as total_hours
      FROM "ChangeLog" cl
      JOIN "GameTag" gt ON cl."gameId" = gt."gameId"
      WHERE cl."createdAt" BETWEEN ${Number(params.startDate)} AND ${Number(
        params.endDate,
      )}
      GROUP BY gt."tagId"
      ORDER BY total_hours DESC
      LIMIT 10;
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          playedTime,
          states,
          tags,
        },
        (_, value) => (typeof value === "bigint" ? Number(value) : value),
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(error),
    };
  }
};

export { handler };
