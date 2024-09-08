import { ChangeLog } from "@prisma/client";
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
      stateId: game.stateId,
      obtainedAchievements: game.achievements?.obtained || 0,
      totalAchievements: game.achievements?.total || 0,
      imageUrl: game.imageUrl,
      platform: game.platform,
      gameTags: game.tags
        ? {
            createMany: {
              data: game.tags.create.map((tag: string) => ({ tagId: tag })),
            },
          }
        : undefined,
      changeLogs: game.changeLogs
        ? {
            createMany: {
              data: game.changeLogs.create.map((changelog: ChangeLog) => ({
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

  return createdGame;
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
