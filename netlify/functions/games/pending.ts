import { CustomHandler } from "../../types";
import { Game } from "../../../src/ts/api/games";

const pendingHandler: CustomHandler<"games/pending"> = async (prisma) => {
  const games = await prisma.game.findMany({
    where: {
      state: {
        notIn: ["PLAYING", "BANNED"],
      },
      OR: [{ mark: { lt: 0 } }, { review: null }, { review: "" }],
    },
    skip: 0,
    take: 12,
    orderBy: {
      end: "desc",
    },
    select: {
      id: true,
      imageUrl: true,
      appid: true,
      name: true,
      review: true,
      mark: true,
    },
  });

  return games as Game[];
};

export default {
  path: "pending",
  handler: pendingHandler,
  needsAuth: true,
};
