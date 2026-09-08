import { CustomHandler } from "../../types";

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
    take: params.take || 24,
    orderBy: {
      end: "desc",
    },
    select: {
      id: true,
      appid: true,
      name: true,
      imageUrl: true,
      obtainedAchievements: true,
      totalAchievements: true,
      playedTime: true,
      extraPlayedTime: true,
      tags: true,
      changelogs: {
        select: {
          achievements: true,
          createdAt: true,
          hours: true,
          gameId: true,
          id: true,
          state: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return changelogs;
};

export default {
  path: "getWithChangelogs",
  handler: getHandler,
  needsAuth: true,
};
