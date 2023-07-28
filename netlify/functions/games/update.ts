import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const handler: Handler = async (event) => {
  const gameData = JSON.parse(event.body || '{}');
  try {
    const updatedGame = await prisma.game.update({
      where: { appid: gameData.appid },
      data: {
        name: gameData.name,
        playedTime: gameData.hours || 0,
        imageUrl: gameData.imageUrl || '',
        start: gameData.start,
        end: gameData.end,
        obtainedAchievements: gameData.achievements[0],
        totalAchievements: gameData.achievements[1],
        state: {
          connectOrCreate: {
            where: { id: gameData.state },
            create: {
              id: gameData.state,
              hue: 0,
            },
          }
        },
        score: {
          update: {
            finalMark: gameData.score?.finalMark || 0,
            bosses: gameData.score?.bosses,
            content: gameData.score?.content,
            controls: gameData.score?.controls,
            graphics: gameData.score?.graphics,
            music: gameData.score?.music,
            lore: gameData.score?.lore,
            mechanics: gameData.score?.mechanics,
            extras: {
              deleteMany: {}, // Borra todas las extras antes de crear las nuevas
              create: gameData.score?.extra?.map((extra) => ({
                bias: extra.bias,
                info: extra.info,
              })) || [],
            },
          },
        },
        gameTags: {
          deleteMany: {}, // Borra todos los gameTags existentes antes de crear los nuevos
          create: gameData.tags.map((tag) => ({
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
    });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGame)
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