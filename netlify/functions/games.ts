import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import isAuthorized from "../auth/isAuthorized";
import { GameI, QueryStringParams } from "../types";
import { upsertGame } from "../utils/games";

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (event.httpMethod !== "GET" && !isAuthorized(event.headers)) {
    return {
      statusCode: 401,
      headers: headers,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  switch (event.httpMethod) {
    case "GET": {
      const params: QueryStringParams = event.queryStringParameters || {};
      const pageSize = params?.pageSize ? parseInt(params.pageSize) : 20;
      const page = params?.page ? parseInt(params.page) : 1;
      console.log(params);
      try {
        const games = await prisma.game.findMany({
          where: {
            name: params?.name ? { contains: params.name } : undefined,
            stateId: params?.state || undefined,
            gameTags: params?.tags
              ? { some: { tagId: { in: params.tags.split(",") } } }
              : undefined,
            start: params?.start ? { gte: Number(params.start) } : undefined,
            end: params?.end ? { lte: Number(params.end) } : undefined,
            appid: params?.appids
              ? { in: params.appids.split(",").map((id) => Number(id)) }
              : undefined,
          },
          include: {
            score: {
              include: {
                extras: true,
              },
            },
            gameTags: true,
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: {
            [params?.sortBy || "end"]: params?.sortDirection || "desc",
          },
        });
        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(games),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: headers,
          body: JSON.stringify(error),
        };
      }
    }
    case "POST": {
      const body: GameI[] = JSON.parse(event.body || "[]");
      try {
        for (const game of body) {
          await prisma.$transaction(async (prisma) => {
            return await upsertGame(prisma, game, true);
          });
        }

        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({ success: true, }),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: headers,
          body: JSON.stringify(error),
        };
      }
    }
    case "PUT": {
      const gameData: GameI = JSON.parse(event.body || "{}");
      console.log(gameData);
      try {
        let updatedGame
        await prisma.$transaction(async (prisma) => {
          updatedGame = await upsertGame(prisma, gameData, true);
        });

        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(updatedGame),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: headers,
          body: JSON.stringify(error),
        };
      }
    }
    case "DELETE": {
      const gameData = JSON.parse(event.body || "{}");
      try {
        const deletedGame = await prisma.game.delete({
          where: { id: gameData.id },
        });
        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(deletedGame),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: headers,
          body: JSON.stringify(error),
        };
      }
    }
    default: {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }
  }
};

export { handler };
