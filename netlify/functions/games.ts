import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

export interface ExtraScoreI {
  bias: string;
  info: string;
}

export interface ScoreI {
  content?: string;
  lore?: string;
  mechanics?: string;
  bosses?: string;
  controls?: string;
  music?: string;
  graphics?: string;
  extra?: Array<ExtraScoreI>;
  finalMark: string;
}

export interface GameI {
  id: string;
  appid?: string;
  name: string;
  start: string;
  tags: Array<string>;
  state: string;
  end: string;
  playedTime: string;
  extraPlayedTime?: string;
  score?: ScoreI;
  imageUrl?: string;
  achievements: [string, string];
}

const prisma = new PrismaClient();

const handler: Handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  switch (event.httpMethod) {
    case "GET": {
      const params = event.queryStringParameters;
      const pageSize = params?.pageSize ? parseInt(params.pageSize) : 20;
      const pageNumber = params?.pageNumber ? parseInt(params.pageNumber) : 1;
      console.log(params);
      console.log(params?.appids?.split(",").map((id) => Number(id)));
      try {
        const games = await prisma.game.findMany({
          where: {
            name: params?.name ? { contains: params.name } : undefined,
            state: params?.state ? { id: params.state } : undefined,
            gameTags: params?.tag
              ? { some: { tag: { id: params.tag } } }
              : undefined,
            start: params?.start ? { gte: Number(params.start) } : undefined,
            end: params?.end ? { lte: Number(params.end) } : undefined,
            appid: params?.appids
              ? { in: params.appids.split(",").map((id) => Number(id)) }
              : undefined,
          },
          include: {
            score: {
              include: {
                extras: true,
              },
            },
            gameTags: true,
          },
          skip: pageSize * (pageNumber - 1),
          take: pageSize,
          orderBy: {
            [params?.orderBy || "end"]: params?.order || "desc",
          },
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
    case "POST": {
      const body: GameI[] = JSON.parse(event.body || "[]");
      try {
        for (const game of body) {
          await prisma.$transaction(async (prisma) => {
            const prevData = game.id
              ? await prisma.game.findUnique({
                  where: { id: game.id },
                  select: {
                    obtainedAchievements: true,
                    stateId: true,
                    playedTime: true,
                    extraPlayedTime: true,
                  },
                })
              : undefined;
            const updatedGame = await prisma.game.upsert({
              where: { id: game.id || "" },
              update: {
                name: game.name,
                appid: Number(game.appid),
                start: Number(game.start),
                end: Number(game.end),
                imageUrl:
                  game.imageUrl ||
                  "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/spanish/Header_1.jpg",
                playedTime: Number(game.playedTime || 0),
                extraPlayedTime: Number(game.extraPlayedTime || 0),
                obtainedAchievements: Number(game.achievements?.[0] || 0),
                totalAchievements: Number(game.achievements?.[1] || 0),
                state: {
                  connectOrCreate: {
                    where: { id: game.state },
                    create: {
                      id: game.state,
                      hue: 0,
                    },
                  },
                },
                score: game.score
                  ? {
                      update: {
                        finalMark: Number(game.score.finalMark),
                        bosses: Number(game.score.bosses),
                        content: Number(game.score.content),
                        controls: Number(game.score.controls),
                        graphics: Number(game.score.graphics),
                        music: Number(game.score.music),
                        lore: Number(game.score.lore),
                        mechanics: Number(game.score.mechanics),
                        extras: game.score.extra
                          ? {
                              deleteMany: {}, // Borra todas las extras antes de crear las nuevas
                              create: game.score.extra.map(
                                (extra: ExtraScoreI) => ({
                                  bias: Number(extra.bias),
                                  info: extra.info,
                                })
                              ),
                            }
                          : undefined,
                      },
                    }
                  : undefined,
                gameTags: {
                  deleteMany: {}, // Borra todos los gameTags existentes antes de crear los nuevos
                  create: game.tags.map((tag) => ({
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
              create: {
                name: game.name,
                appid: Number(game.appid),
                start: Number(game.start),
                end: Number(game.end),
                imageUrl:
                  game.imageUrl ||
                  "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/spanish/Header_1.jpg",
                playedTime: Number(game.playedTime || 0),
                extraPlayedTime: Number(game.extraPlayedTime || 0),
                obtainedAchievements: Number(game.achievements?.[0] || 0),
                totalAchievements: Number(game.achievements?.[1] || 0),
                state: {
                  connectOrCreate: {
                    where: { id: game.state },
                    create: {
                      id: game.state,
                      hue: 0,
                    },
                  },
                },
                score: game.score
                  ? {
                      create: {
                        finalMark: Number(game.score.finalMark),
                        bosses: Number(game.score.bosses),
                        content: Number(game.score.content),
                        controls: Number(game.score.controls),
                        graphics: Number(game.score.graphics),
                        music: Number(game.score.music),
                        lore: Number(game.score.lore),
                        mechanics: Number(game.score.mechanics),
                        extras: game.score.extra
                          ? {
                              create: game.score.extra.map(
                                (extra: ExtraScoreI) => ({
                                  bias: Number(extra.bias),
                                  info: extra.info,
                                })
                              ),
                            }
                          : undefined,
                      },
                    }
                  : undefined,
                gameTags: {
                  create: game.tags.map((tag) => ({
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

            await prisma.changeLog.create({
              data: {
                createdAt: Number(updatedGame.end),
                achievements:
                  updatedGame.obtainedAchievements -
                  (prevData?.obtainedAchievements || 0),
                hours:
                  updatedGame.playedTime -
                  (prevData?.playedTime || 0) +
                  (updatedGame.extraPlayedTime || 0) -
                  (prevData?.extraPlayedTime || 0),
                game: {
                  connect: {
                    id: updatedGame.id,
                  },
                },
                state: {
                  connect: {
                    id: updatedGame.stateId,
                  },
                },
              },
            });

            return updatedGame;
          });
        }

        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({ success: true, }),
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
    case "PUT": {
      const gameData: GameI = JSON.parse(event.body || "{}");
      try {
        const prevData = await prisma.game.findUnique({
          where: { id: gameData.id },
          select: {
            obtainedAchievements: true,
            stateId: true,
            playedTime: true,
            extraPlayedTime: true,
          },
        });
        const updatedGame = await prisma.game.update({
          where: { id: gameData.id },
          data: {
            name: gameData.name,
            appid: Number(gameData.appid),
            start: Number(gameData.start),
            end: Number(gameData.end),
            imageUrl:
              gameData.imageUrl ||
              "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/spanish/Header_1.jpg",
            playedTime: Number(gameData.playedTime || 0),
            extraPlayedTime: Number(gameData.extraPlayedTime || 0),
            obtainedAchievements: Number(gameData.achievements?.[0] || 0),
            totalAchievements: Number(gameData.achievements?.[1] || 0),
            state: {
              connectOrCreate: {
                where: { id: gameData.state },
                create: {
                  id: gameData.state,
                  hue: 0,
                },
              },
            },
            score: gameData.score
              ? {
                  update: {
                    finalMark: Number(gameData.score.finalMark),
                    bosses: Number(gameData.score.bosses),
                    content: Number(gameData.score.content),
                    controls: Number(gameData.score.controls),
                    graphics: Number(gameData.score.graphics),
                    music: Number(gameData.score.music),
                    lore: Number(gameData.score.lore),
                    mechanics: Number(gameData.score.mechanics),
                    extras: gameData.score.extra
                      ? {
                          deleteMany: {}, // Borra todas las extras antes de crear las nuevas
                          create: gameData.score.extra.map(
                            (extra: ExtraScoreI) => ({
                              bias: Number(extra.bias),
                              info: extra.info,
                            })
                          ),
                        }
                      : undefined,
                  },
                }
              : undefined,
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

        await prisma.changeLog.create({
          data: {
            createdAt: Number(updatedGame.end),
            achievements:
              updatedGame.obtainedAchievements -
              (prevData?.obtainedAchievements || 0),
            hours:
              updatedGame.playedTime -
              (prevData?.playedTime || 0) +
              (updatedGame.extraPlayedTime || 0) -
              (prevData?.extraPlayedTime || 0),
            game: {
              connect: {
                id: updatedGame.id,
              },
            },
            state: {
              connect: {
                id: updatedGame.stateId,
              },
            },
          },
        });
        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(updatedGame),
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
    case "DELETE": {
      const gameData = JSON.parse(event.body || "{}");
      try {
        const deletedGame = await prisma.game.delete({
          where: { id: gameData.id },
        });
        return {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(deletedGame),
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
