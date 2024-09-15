import { CustomHandler } from "../../types";
import { formatGame } from "../../utils/format";

const getHandler: CustomHandler<"changelogs/games"> = async (
  prisma,
  params,
) => {
  const changelogs = await prisma.game.findMany({
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" }
        : undefined,
      state: params.state,
      gameTags: params.tags
        ? { some: { tagId: { in: params.tags } } }
        : undefined,
      start: params.start ? { gte: params.start } : undefined,
      end: params.end ? { lte: params.end } : undefined,
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
  return changelogs.map(formatGame);
};

export default {
  path: "games",
  handler: getHandler,
  needsAuth: true,
};
