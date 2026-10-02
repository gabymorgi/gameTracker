import { CustomHandler } from "../../types";

const updateHandler: CustomHandler<"games/update"> = async (prisma, game) => {
  const gameData = {
    appid: game.appid,
    name: game.name,
    start: game.start,
    end: game.end,
    mark: game.mark,
    review: game.review,
    totalAchievements: game.totalAchievements,
    imageUrl: game.imageUrl,
    platform: game.platform,
    ost: game.ost,
    tags: game.tags,
    state: game.state,
  };

  if (Object.values(gameData).some((v) => v !== undefined)) {
    return await prisma.game.update({
      where: { id: game.id },
      data: gameData,
    });
  } else {
    return await prisma.game.findFirstOrThrow({
      where: { id: game.id },
    });
  }
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
