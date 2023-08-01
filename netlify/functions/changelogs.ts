import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

export interface ChangelogI {
  id: string
  achievements: number
  createdAt: number
  gameId: string
  gameName: string
  hours: number
  state: string
}

const prisma = new PrismaClient()

const handler: Handler = async (event) => {
  switch (event.httpMethod) {
    case "GET": {
      const params = event.queryStringParameters;
      const pageSize = params?.pageSize ? parseInt(params.pageSize) : 20;
      const pageNumber = params?.pageNumber ? parseInt(params.pageNumber) : 1;
      try {
        const changelogs = await prisma.changeLog.findMany({
          where: {
            gameId: params?.gameId || undefined,
            createdAt: {
              gte: params?.startDate ? Number(params.startDate) : undefined,
              lte: params?.endDate ? Number(params.endDate) : undefined,
            }
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
    }
    case "POST": {
      try {
        const body = JSON.parse(event.body || '[]');
        const changelogPromises = body.map((changelog: ChangelogI) =>
          prisma.changeLog.create({
            data: {
              createdAt: Number(changelog.createdAt),
              achievements: Number(changelog.achievements),
              hours: Number(changelog.hours),
              game: {
                connect: {
                  id: changelog.gameId,
                },
              },
              state: {
                connect: {
                  id: changelog.state,
                },
              },
            }
          })
        )
        const changelog = await prisma.$transaction(changelogPromises);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(changelog)
        }
      }
      catch (error) {
        console.error(error)
        return {
          statusCode: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(error)
        }
      }
    }
    default: {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Method not allowed' })
      }
    }
  }
};

export { handler };