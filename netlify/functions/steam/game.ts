import { GameState } from "@prisma/client";
import { CustomHandler } from "../../types";

const handler: CustomHandler<"steam/games"> = async (prisma, params) => {
  const games = await prisma.game.findMany({
    where: {
      appid: params.appids ? { in: params.appids } : undefined,
    },
    include: {
      gameTags: true,
      changeLogs: true,
    },
  });
  return games.map((game) => ({
    ...game,
    tags: game.gameTags.map((tag) => tag.tagId),
  }));
};

export default {
  path: "game",
  handler: handler,
  needsAuth: false,
};
