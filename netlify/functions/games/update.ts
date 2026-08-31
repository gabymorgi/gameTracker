import { Prisma } from "#prisma-client";
import { $SafeAny, CustomHandler } from "../../types";
import { formatGame } from "../../utils/format";

const updateHandler: CustomHandler<"games/update"> = async (prisma, game) => {
  const tagOps: Prisma.PrismaPromise<$SafeAny>[] = [];
  if (game.tags) {
    if (game.tags.create.length > 0) {
      tagOps.push(
        prisma.gameTag.createMany({
          data: game.tags.create.map((tag) => ({
            gameId: game.id!,
            tagId: tag.toString(),
          })),
        }),
      );
    }
    if (game.tags.delete.length > 0) {
      tagOps.push(
        prisma.gameTag.deleteMany({
          where: { gameId: game.id, tagId: { in: game.tags.delete } },
        }),
      );
    }
  }

  const changelogOps: Prisma.PrismaPromise<$SafeAny>[] = [];
  if (game.changelogs) {
    if (game.changelogs.create.length > 0) {
      changelogOps.push(
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
        changelogOps.push(
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
      changelogOps.push(
        prisma.changelog.deleteMany({
          where: { id: { in: game.changelogs.delete } },
        }),
      );
    }
  }

  await Promise.all([
    tagOps.length > 0 ? prisma.$transaction(tagOps) : Promise.resolve(),
    changelogOps.length > 0
      ? prisma.$transaction(changelogOps)
      : Promise.resolve(),
  ]);

  const gameData = {
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
    ost: game.ost,
  };

  if (Object.values(gameData).some((v) => v !== undefined)) {
    const updateGame = await prisma.game.update({
      where: { id: game.id },
      data: gameData,
      include: { gameTags: true },
    });
    return formatGame(updateGame);
  } else {
    const updateGame = await prisma.game.findFirstOrThrow({
      where: { id: game.id },
      include: { gameTags: true },
    });
    return formatGame(updateGame);
  }
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
