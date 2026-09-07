import { GameState } from "#prisma-client";
import { CustomHandler } from "../../types";

const getHandler: CustomHandler<"games/get"> = async (prisma, params) => {
  const games = await prisma.game.findMany({
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" }
        : undefined,
      state: params.state as GameState,
      tags: params.tags ? { hasSome: params.tags } : undefined,
      start: params.end ? { lte: params.end } : undefined,
      end: params.start ? { gte: params.start } : undefined,
    },
    skip: params.skip,
    take: params.take,
    orderBy: {
      [params.sortBy || "end"]: params.sortDirection || "desc",
    },
  });
  return games;
};

export default {
  path: "get",
  handler: getHandler,
  needsAuth: false,
};
