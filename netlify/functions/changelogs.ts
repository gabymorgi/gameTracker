import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

export interface ChangelogI {
  id: string
  achievements: number
  createdAt: number
  gameId: string
  gameName: string
  hours: number
  stateId: string
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
          select: {
            achievements: true,
            createdAt: true,
            hours: true,
            gameId: true,
            id: true,
            stateId: true,
            game: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
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
          prisma.changeLog.upsert({
            where: {
              id: changelog.id,
            },
            create: {
              id: changelog.id,
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
                  id: changelog.stateId,
                },
              },
            },
            update: {
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
                  id: changelog.stateId,
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
    case "PUT": {
      try {
        const changelog: ChangelogI = JSON.parse(event.body || '{}');
        await prisma.changeLog.update({
          where: {
            id: changelog.id,
          },
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
                id: changelog.stateId,
              },
            },
          }
        })
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
    case "DELETE": {
      try {
        const id: string = event.queryStringParameters?.id || '';
        const changelog = await prisma.changeLog.delete({
          where: {
            id: id,
          },
        })
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