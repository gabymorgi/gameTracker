import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const result = await prisma.$queryRaw`
      WITH monthly_games AS (
        SELECT 
          DATE_TRUNC('month', to_timestamp(start)) AS month,
          COUNT(*) AS games_played,
          SUM(end - start) AS total_hours_played,
          stateId
        FROM 
          Game 
        WHERE 
          start BETWEEN ${Number(params.startDate)} AND ${Number(params.endDate)}
        GROUP BY 
          month, stateId
      ),
      monthly_game_tags AS (
        SELECT 
          DATE_TRUNC('month', to_timestamp(start)) AS month,
          SUM(end - start) AS total_hours_played,
          tagId
        FROM 
          Game 
          JOIN GameTag ON Game.id = GameTag.gameId
        WHERE 
          start BETWEEN ${Number(params.startDate)} AND ${Number(params.endDate)}
        GROUP BY 
          month, tagId
      )
      SELECT 
        monthly_games.month, 
        monthly_games.games_played, 
        monthly_games.total_hours_played,
        monthly_games.stateId,
        monthly_game_tags.total_hours_played AS total_hours_played_per_tag,
        monthly_game_tags.tagId
      FROM 
        monthly_games 
        JOIN monthly_game_tags ON monthly_games.month = monthly_game_tags.month
    `;
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(error),
    };
  }
};

export { handler };
