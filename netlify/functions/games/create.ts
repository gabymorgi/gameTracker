import { Platform } from "@prisma/client";
import { CustomHandler } from "../../types";

interface ExtraScoreI {
  id: string;
  bias: number;
  info: string;
}

interface ScoreI {
  id: string;
  content?: number;
  lore?: number;
  mechanics?: number;
  bosses?: number;
  controls?: number;
  music?: number;
  graphics?: number;
  extras?: Array<ExtraScoreI>;
  finalMark: number;
}

interface GameI {
  id: string;
  appid: number;
  name: string;
  start: number;
  tags: Array<string>;
  stateId: string;
  end: number;
  playedTime: number;
  extraPlayedTime: number;
  score?: ScoreI;
  imageUrl: string;
  achievements: {
    obtained: number;
    total: number;
  };
  platform: Platform;
  changeLogs?: Array<ChangeLogI>;
}

interface ChangeLogI {
  id: string;
  createdAt: number;
  hours: number;
  achievements: number;
  stateId: string;
}

const createHandler: CustomHandler = async (prisma, _, game: GameI) => {
  const createdGame = await prisma.game.create({
    data: {
      appid: game.appid,
      name: game.name,
      start: game.start,
      end: game.end,
      playedTime: game.playedTime,
      extraPlayedTime: game.extraPlayedTime,
      stateId: game.stateId,
      obtainedAchievements: game.achievements.obtained,
      totalAchievements: game.achievements.total,
      imageUrl: game.imageUrl,
      platform: game.platform,
      gameTags: {
        createMany: {
          data: game.tags.map((tag) => ({
            tagId: tag,
          })),
        },
      },
      changeLogs: game.changeLogs
        ? {
            createMany: {
              data: game.changeLogs.map((changelog) => ({
                createdAt: changelog.createdAt,
                hours: changelog.hours,
                achievements: changelog.achievements,
                stateId: changelog.stateId,
              })),
            },
          }
        : undefined,
    },
  });

  // something doesn't allow to create score in the same transaction
  if (game.score) {
    await prisma.score.create({
      data: {
        content: game.score.content,
        lore: game.score.lore,
        mechanics: game.score.mechanics,
        bosses: game.score.bosses,
        controls: game.score.controls,
        music: game.score.music,
        graphics: game.score.graphics,
        extras: game.score.extras
          ? {
              createMany: {
                data: game.score.extras.map((extra) => ({
                  bias: extra.bias,
                  info: extra.info,
                })),
              },
            }
          : undefined,
        finalMark: game.score.finalMark,
        game: {
          connect: {
            id: createdGame.id,
          },
        },
      },
    });
  }

  return createdGame;
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
