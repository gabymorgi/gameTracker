import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  const search: string = event.queryStringParameters?.search || "";
  try {
    const game = await prisma.game.findMany({
      where: {
        name: {
          mode: "insensitive",
          contains: search,
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
      take: 5,
    });
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(error),
    };
  }
};

export { handler };
