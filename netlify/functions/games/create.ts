import { CustomHandler } from "../../types";

const createHandler: CustomHandler<"games/create"> = async (prisma, game) => {
  return await prisma.game.create({
    data: {
      appid: game.appid,
      name: game.name,
      start: game.start,
      end: game.end,
      playedTime: 0,
      extraPlayedTime: 0,
      mark: game.mark,
      review: game.review,
      obtainedAchievements: 0,
      totalAchievements: game.totalAchievements || 0,
      imageUrl: game.imageUrl,
      platform: game.platform,
      state: game.state,
      tags: game.tags ?? [],
    },
  });
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
