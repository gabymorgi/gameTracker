import { GameState } from "@prisma/client";
import { CustomHandler } from "../../types";

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
      start: params.start ? { gte: new Date(params.start) } : undefined,
      end: params.end ? { lte: new Date(params.end) } : undefined,
    },
    include: {
      gameTags: true,
    },
    skip: params.skip,
    take: params.take,
    orderBy: {
      [params.sortBy || "end"]: params.sortDirection || "desc",
    },
  });
  return games.map((game) => ({
    ...game,
    tags: game.gameTags.map((tag) => tag.tagId),
  }));
};

export default {
  path: "get",
  handler: getHandler,
  needsAuth: false,
};
