import { Prisma } from "@prisma/client";
import { $SafeAny, CustomHandler } from "../../types";
import { formatGame } from "../../utils/format";

const updateHandler: CustomHandler<"games/update"> = async (prisma, game) => {
  // game tags
  if (game.tags) {
    if (game.tags.create.length > 0) {
      await prisma.gameTag.createMany({
        data: game.tags.create.map((tag) => ({
          gameId: game.id!,
          tagId: tag.toString(),
        })),
      });
    }
    if (game.tags.delete.length > 0) {
      await prisma.gameTag.deleteMany({
        where: {
          gameId: game.id,
          tagId: {
            in: game.tags.delete,
          },
        },
      });
    }
  }

  if (game.changelogs) {
    const transactions: Prisma.PrismaPromise<$SafeAny>[] = [];
    if (game.changelogs.create.length > 0) {
      transactions.push(
        prisma.changelog.createMany({
          data: game.changelogs.create.map((changelog) => ({
            createdAt: changelog.createdAt,
            hours: changelog.hours,
            achievements: changelog.achievements,
            gameId: game.id!,
            state: changelog.state,
          })),
        }),
      );
    }
    if (game.changelogs.update.length > 0) {
      for (const changelog of game.changelogs.update) {
        transactions.push(
          prisma.changelog.update({
            where: { id: changelog.id },
            data: {
              createdAt: changelog.createdAt,
              hours: changelog.hours,
              achievements: changelog.achievements,
              state: changelog.state,
            },
          }),
        );
      }
    }
    if (game.changelogs.delete.length > 0) {
      transactions.push(
        prisma.changelog.deleteMany({
          where: {
            id: {
              in: game.changelogs.delete,
            },
          },
        }),
      );
    }
  }

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
        state: game.state,
        obtainedAchievements: game.achievements?.obtained,
        totalAchievements: game.achievements?.total,
        imageUrl: game.imageUrl,
        platform: game.platform,
      },
    });
    return formatGame(updateGame);
  } else {
    const updateGame = await prisma.game.findFirstOrThrow({
      where: { id: game.id },
    });
    return formatGame(updateGame);
  }
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
