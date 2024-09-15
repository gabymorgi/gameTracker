import { CustomHandler } from "../../types";
import { formatGame } from "../../utils/format";

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
      obtainedAchievements: game.achievements?.obtained || 0,
      totalAchievements: game.achievements?.total || 0,
      imageUrl: game.imageUrl,
      platform: game.platform,
      gameTags: game.tags
        ? {
            createMany: {
              data: game.tags.create.map((tag) => ({ tagId: tag.toString() })),
            },
          }
        : undefined,
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
    include: {
      gameTags: true,
    },
  });

  return formatGame(createdGame);
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
