import { CustomHandler } from "../../types";

const getHandler: CustomHandler<"changelogs/games"> = async (
  prisma,
  params,
) => {
  const changeLogs = await prisma.game.findMany({
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" }
        : undefined,
      stateId: params.state || undefined,
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
      name: true,
      imageUrl: true,
      obtainedAchievements: true,
      playedTime: true,
      extraPlayedTime: true,
      changeLogs: {
        select: {
          achievements: true,
          createdAt: true,
          hours: true,
          gameId: true,
          id: true,
          stateId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return changeLogs;
};

export default {
  path: "games",
  handler: getHandler,
  needsAuth: true,
};
