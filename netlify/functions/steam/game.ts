import { CustomHandler } from "../../types";
import { formatGame } from "../../utils/format";

const handler: CustomHandler<"steam/game"> = async (prisma, params) => {
  const games = await prisma.game.findMany({
    where: {
      appid: params.appids ? { in: params.appids } : undefined,
    },
    include: {
      gameTags: true,
      changelogs: {
        take: 6,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return games.map(formatGame);
};

export default {
  path: "game",
  handler: handler,
  needsAuth: false,
};
