import { Platform, Prisma } from "@prisma/client";
import { CRUDArray, CustomHandler } from "../../types";

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
  extras?: CRUDArray<ExtraScoreI>;
  finalMark: number;
}

interface GameI {
  id: string;
  appid?: number;
  name?: string;
  start?: Date;
  tags?: CRUDArray<string>;
  stateId?: string;
  end?: Date;
  playedTime?: number;
  extraPlayedTime?: number;
  score?: ScoreI;
  imageUrl?: string;
  achievements?: {
    obtained: number;
    total: number;
  };
  platform?: Platform;
  changeLogs?: CRUDArray<ChangeLogI>;
}

interface ChangeLogI {
  id: string;
  createdAt: string;
  hours: number;
  achievements: number;
  stateId: string;
}

const updateHandler: CustomHandler = async (prisma, game: GameI) => {
  const updatedData: any = {};

  if (
    [
      "appid",
      "name",
      "start",
      "end",
      "playedTime",
      "extraPlayedTime",
      "stateId",
      "achievements",
      "achievements",
      "imageUrl",
      "platform",
    ].some((key) => game.hasOwnProperty(key))
  ) {
    const updateGame = await prisma.game.update({
      where: { id: game.id },
      data: {
        appid: game.appid,
        name: game.name,
        start: game.start,
        end: game.end,
        playedTime: game.playedTime,
        extraPlayedTime: game.extraPlayedTime,
        stateId: game.stateId,
        obtainedAchievements: game.achievements?.obtained,
        totalAchievements: game.achievements?.total,
        imageUrl: game.imageUrl,
        platform: game.platform,
      },
    });
    updatedData.game = updateGame;
  }

  // game tags
  if (game.tags) {
    updatedData.tags = {};
    if (game.tags.create.length > 0) {
      const createTags = await prisma.gameTag.createMany({
        data: game.tags.create.map((tag) => ({
          gameId: game.id,
          tagId: tag,
        })),
      });

      updatedData.tags.create = createTags;
    }
    if (game.tags.delete.length > 0) {
      const deleteTag = await prisma.gameTag.deleteMany({
        where: {
          gameId: game.id,
          tagId: {
            in: game.tags.delete,
          },
        },
      });

      updatedData.tags.delete = deleteTag;
    }
  }

  // game score
  if (game.score) {
    if (
      [
        "content",
        "lore",
        "mechanics",
        "bosses",
        "controls",
        "music",
        "graphics",
        "finalMark",
      ].some((key) => game.score?.hasOwnProperty(key))
    ) {
      const updateScore = await prisma.score.update({
        where: {
          id: game.score.id,
        },
        data: {
          content: game.score.content,
          lore: game.score.lore,
          mechanics: game.score.mechanics,
          bosses: game.score.bosses,
          controls: game.score.controls,
          music: game.score.music,
          graphics: game.score.graphics,
          finalMark: game.score.finalMark,
        },
      });

      updatedData.score = updateScore;
    }

    if (game.score.extras) {
      const transactions: Prisma.PrismaPromise<any>[] = [];

      if (game.score.extras.create.length > 0) {
        transactions.push(
          prisma.scoreExtras.createMany({
            data: game.score.extras.create.map((extra) => ({
              bias: extra.bias,
              info: extra.info,
              scoreId: game.score!.id,
            })),
          }),
        );
      }

      if (game.score.extras.update.length > 0) {
        updatedData.extraScore.update = [];
        for (const extra of game.score.extras.update) {
          transactions.push(
            prisma.scoreExtras.update({
              where: { id: extra.id },
              data: {
                bias: extra.bias,
                info: extra.info,
              },
            }),
          );
        }
      }

      if (game.score.extras.delete.length > 0) {
        transactions.push(
          prisma.scoreExtras.deleteMany({
            where: {
              id: {
                in: game.score.extras.delete,
              },
            },
          }),
        );
      }

      updatedData.extraScore = await prisma.$transaction(transactions);
    }
  }

  if (game.changeLogs) {
    const transactions: Prisma.PrismaPromise<any>[] = [];
    if (game.changeLogs.create.length > 0) {
      transactions.push(
        prisma.changeLog.createMany({
          data: game.changeLogs.create.map((changelog) => ({
            createdAt: changelog.createdAt,
            hours: changelog.hours,
            achievements: changelog.achievements,
            gameId: game.id,
            stateId: changelog.stateId,
          })),
        }),
      );
    }
    if (game.changeLogs.update.length > 0) {
      for (const changelog of game.changeLogs.update) {
        transactions.push(
          prisma.changeLog.update({
            where: { id: changelog.id },
            data: {
              createdAt: changelog.createdAt,
              hours: changelog.hours,
              achievements: changelog.achievements,
              stateId: changelog.stateId,
            },
          }),
        );
      }
    }
    if (game.changeLogs.delete.length > 0) {
      transactions.push(
        prisma.changeLog.deleteMany({
          where: {
            id: {
              in: game.changeLogs.delete,
            },
          },
        }),
      );
    }
    updatedData.changeLogs = await prisma.$transaction(transactions);
  }
  return updatedData;
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
