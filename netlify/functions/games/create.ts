import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const handler: Handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  try {
    const games = await prisma.game.create({
      data: {
        name: body.name,
        state: {
          connectOrCreate: {
            where: { id: body.state },
            create: {
              id: body.state,
              hue: 0,
            },
          }
        },
        start: body.start,
        end: body.end,
        imageUrl: body.imageUrl,
        playedTime: body.playedTime,
        extraPlayedTime: body.extraPlayedTime,
        obtainedAchievements: body.obtainedAchievements,
        totalAchievements: body.totalAchievements,
        score: {
          create: {
            finalMark: body.finalMark,
            bosses: body.bosses,
            content: body.content,
            controls: body.controls,
            graphics: body.graphics,
            music: body.music,
            lore: body.lore,
            mechanics: body.mechanics,
            extras: {
              create: {
                bias: body.bias,
                info: body.info,
              },
            },
          },
        },
        gameTags: {
          create: body.tags.map((tag: string) => ({
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