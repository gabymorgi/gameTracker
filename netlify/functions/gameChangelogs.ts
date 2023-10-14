import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import isAuthorized from "../auth/isAuthorized";

interface QueryStringParams {
  page?: string
  pageSize?: string
  name?: string
  start?: string
  end?: string
  state?: string
  tags?: string
  appids?: string
  sortBy?: string
  sortDirection?: string
}

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
          select: {
            changeLogs: {
              select: {
                id: true,
                hours: true,
                stateId: true,
                achievements: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            id: true,
            name: true,
            imageUrl: true,
            playedTime: true,
            extraPlayedTime: true,
            obtainedAchievements: true,
          },
          skip: pageSize * (page - 1),
          take: pageSize,
          orderBy: [
            { [params?.sortBy || "end"]: params?.sortDirection || "desc" },
            { id: 'asc' }
          ],
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
