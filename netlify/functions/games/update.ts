import { Prisma } from "#prisma-client";
import { $SafeAny, CustomHandler } from "../../types";

const updateHandler: CustomHandler<"games/update"> = async (prisma, game) => {
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

  if (changelogOps.length > 0) {
    await prisma.$transaction(changelogOps);
  }

  let tags: string[] | undefined;
  if (
    game.tags &&
    (game.tags.create.length > 0 || game.tags.delete.length > 0)
  ) {
    const currentGame = await prisma.game.findUniqueOrThrow({
      where: { id: game.id },
      select: { tags: true },
    });
    tags = currentGame.tags
      .filter((tag) => !game.tags!.delete.includes(tag))
      .concat(game.tags.create.map((tag) => tag.toString()));
  }

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
    obtainedAchievements: game.obtainedAchievements,
    totalAchievements: game.totalAchievements,
    imageUrl: game.imageUrl,
    platform: game.platform,
    ost: game.ost,
    tags,
  };

  if (Object.values(gameData).some((v) => v !== undefined)) {
    const updateGame = await prisma.game.update({
      where: { id: game.id },
      data: gameData,
    });
    return updateGame;
  } else {
    const updateGame = await prisma.game.findFirstOrThrow({
      where: { id: game.id },
    });
    return updateGame;
  }
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
