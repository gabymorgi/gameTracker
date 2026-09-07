import { CustomHandler } from "../../types";

const createHandler: CustomHandler<"games/create"> = async (prisma, game) => {
  const createdGame = await prisma.game.create({
    data: {
      appid: game.appid,
      name: game.name,
      start: game.start,
      end: game.end,
      playedTime: game.playedTime,
      extraPlayedTime: game.extraPlayedTime,
      mark: game.mark,
      review: game.review,
      state: game.state,
      obtainedAchievements: game.obtainedAchievements || 0,
      totalAchievements: game.totalAchievements || 0,
      imageUrl: game.imageUrl,
      platform: game.platform,
      tags: game.tags?.create.map((tag) => tag.toString()) ?? [],
      changelogs: game.changelogs
        ? {
            createMany: {
              data: game.changelogs.create.map((changelog) => ({
                createdAt: changelog.createdAt,
                hours: changelog.hours,
                achievements: changelog.achievements,
                state: changelog.state,
              })),
            },
          }
        : undefined,
    },
  });

  return createdGame;
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
