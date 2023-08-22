import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import isAuthorized from "./auth/isAuthorized";

interface ChangelogI {
  id: string;
  achievements: number;
  createdAt: number;
  gameId: string;
  gameName: string;
  hours: number;
  state: string;
}

interface ExtraScoreI {
  bias: string;
  info: string;
}

interface ScoreI {
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

interface GameI {
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
  platform?: string;
  changelogs: Array<ChangelogI>;
}

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
      const game: GameI = JSON.parse(event.body || "{}");
      try {
        const res = await prisma.$transaction(async (prisma) => {
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
                    hue: 330,
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
                        hue: 330,
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
                    hue: 330,
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
                        hue: 330,
                        id: tag,
                      },
                    },
                  },
                })),
              },
            },
          });

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

          return updatedGame;
        });

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
            error
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
