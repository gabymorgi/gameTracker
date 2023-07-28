import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const handler: Handler = async (event) => {
  const params = event.queryStringParameters;
  // const body = JSON.parse(event.body || '{}');
  const pageSize = params?.pageSize ? parseInt(params.pageSize) : 20;
  const pageNumber = params?.pageNumber ? parseInt(params.pageNumber) : 1;
  try {
    const changelogs = await prisma.changeLog.findMany({
      where: {
        gameId: params?.gameId || undefined,
      },
      skip: pageSize * (pageNumber - 1),
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changelogs)
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