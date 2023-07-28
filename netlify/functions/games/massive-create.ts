import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const handler: Handler = async (event) => {
  const body = JSON.parse(event.body || '[]');
  try {
    const gamesPromises = body.map((game: any) =>
      prisma.game.create({
        data: {
          name: game.name,
          state: {
            connectOrCreate: {
              where: { id: game.state },
              create: {
                id: game.state,
                hue: 0,
              },
            }
          },
          start: game.start,
          end: game.end,
          imageUrl: game.imageUrl,
          playedTime: game.playedTime,
          extraPlayedTime: game.extraPlayedTime,
          obtainedAchievements: game.obtainedAchievements,
          totalAchievements: game.totalAchievements,
          score: {
            create: {
              finalMark: game.finalMark,
              bosses: game.bosses,
              content: game.content,
              controls: game.controls,
              graphics: game.graphics,
              music: game.music,
              lore: game.lore,
              mechanics: game.mechanics,
              extras: {
                create: {
                  bias: game.bias,
                  info: game.info,
                },
              },
            },
          },
          gameTags: {
            create: game.tags.map((tag: string) => ({
              tag: {
                connectOrCreate: {
                  where: { id: tag },
                  create: {
                    hue: 0,
                    id: tag,
                  },
                },
              },
            })),
          },
        },
      })
    );

    const games = await prisma.$transaction(gamesPromises);

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