import { GameState } from "@prisma/client";
import { CustomHandler } from "../../types";
import { formatGame } from "../../utils/format";

const getHandler: CustomHandler<"games/get"> = async (prisma, params) => {
  const games = await prisma.game.findMany({
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" }
        : undefined,
      state: params.state as GameState,
      gameTags: params.tags
        ? { some: { tagId: { in: params.tags } } }
        : undefined,
      start: params.end ? { lte: params.end } : undefined,
      end: params.start ? { gte: params.start } : undefined,
    },
    skip: params.skip,
    take: params.take,
    orderBy: {
      [params.sortBy || "end"]: params.sortDirection || "desc",
    },
    include: {
      gameTags: true,
    },
  });
  return games.map(formatGame);
};

export default {
  path: "get",
  handler: getHandler,
  needsAuth: false,
};
