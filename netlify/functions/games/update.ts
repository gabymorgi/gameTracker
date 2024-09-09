import { GameState, Platform, Prisma } from "@prisma/client";
import { $SafeAny, CRUDArray, CustomHandler } from "../../types";

interface GameI {
  id: string;
  appid?: number;
  name?: string;
  start?: Date;
  tags?: CRUDArray<string>;
  state?: string;
  end?: Date;
  playedTime?: number;
  extraPlayedTime?: number;
  mark?: number;
  review?: string;
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
  state: string;
}

const updateHandler: CustomHandler = async (prisma, game: GameI) => {
  const updatedData: $SafeAny = {};

  if (
    [
      "appid",
      "name",
      "start",
      "end",
      "playedTime",
      "extraPlayedTime",
      "state",
      "mark",
      "review",
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
        mark: game.mark,
        review: game.review,
        playedTime: game.playedTime,
        extraPlayedTime: game.extraPlayedTime,
        state: game.state as GameState,
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

  if (game.changeLogs) {
    const transactions: Prisma.PrismaPromise<$SafeAny>[] = [];
    if (game.changeLogs.create.length > 0) {
      transactions.push(
        prisma.changeLog.createMany({
          data: game.changeLogs.create.map((changelog) => ({
            createdAt: changelog.createdAt,
            hours: changelog.hours,
            achievements: changelog.achievements,
            gameId: game.id,
            state: changelog.state as GameState,
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
              state: changelog.state as GameState,
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
