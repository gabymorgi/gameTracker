import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const handler: Handler = async (event) => {
  const params = event.queryStringParameters;
  const pageSize = params?.pageSize ? parseInt(params.pageSize) : 20;
  const pageNumber = params?.pageNumber ? parseInt(params.pageNumber) : 1;
  try {
    const games = await prisma.game.findMany({
      where: {
        name: params?.name ? { contains: params.name } : undefined,
        state: params?.state ? { id: params.state } : undefined,
        gameTags: params?.tag ? { some: { tag: { id: params.tag } } } : undefined,
        start: params?.start ? { gte: Number(params.start) } : undefined,
        end: params?.end ? { lte: Number(params.end) } : undefined,
      },
      include: {
        state: true,
        score: {
          include: {
            extras: true,
          },
        },
        gameTags: {
          include: {
            tag: true,
          },
        },
      },
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
      orderBy: {
        [params?.orderBy || 'end']: params?.order || 'desc',
      },
    })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(games)
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    }
  }
};

export { handler };