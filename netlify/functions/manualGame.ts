import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import isAuthorized from "../auth/isAuthorized";
import { ChangeLogI, GameI } from "../types";
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
    case "POST": {
      try {
        const game: GameI & {
          changelogs: Array<ChangeLogI>;
        } = JSON.parse(
          event.body as string
        );
        const res: any[] = [];
        const updatedGame = await upsertGame(prisma, game, false);

        for (const changeLog of game.changelogs) {
          await prisma.changeLog.create({
            data: {
              createdAt: Number(changeLog.createdAt),
              achievements: Number(changeLog.achievements),
              hours: Number(changeLog.hours),
              game: {
                connect: {
                  id: updatedGame.id,
                },
              },
              state: {
                connect: {
                  id: changeLog.state,
                },
              },
            },
          });
        }

        res.push(updatedGame);

        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({
            success: true,
            data: res,
          }),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: headers,
          body: JSON.stringify({
            success: false,
            error,
          }),
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
