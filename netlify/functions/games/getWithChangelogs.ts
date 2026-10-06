import { CustomHandler } from "../../types";
import { gameWithChangelogsInclude } from "../../../src/ts/api/games";

const getHandler: CustomHandler<"games/getWithChangelogs"> = async (
  prisma,
  params,
) => {
  const changelogs = await prisma.game.findMany({
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" }
        : undefined,
      state: params.state,
      tags: params.tags ? { hasSome: params.tags } : undefined,
      start: params.end ? { lte: params.end } : undefined,
      end: params.start ? { gte: params.start } : undefined,
      appid: params.appids ? { in: params.appids } : undefined,
    },
    skip: params.skip,
    take: params.take || 12,
    orderBy: {
      end: "desc",
    },
    include: gameWithChangelogsInclude,
  });
  return changelogs;
};

export default {
  path: "getWithChangelogs",
  handler: getHandler,
  needsAuth: true,
};
