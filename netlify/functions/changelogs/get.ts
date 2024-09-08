import { CustomHandler } from "../../types";

const handler: CustomHandler<"changelogs/get"> = async (prisma, params) => {
  const changeLogs = await prisma.changeLog.findMany({
    where: {
      gameId: params.gameId || undefined,
      createdAt: {
        gte: params.from,
        lte: params.to,
      },
    },
    select: {
      achievements: true,
      createdAt: true,
      hours: true,
      gameId: true,
      id: true,
      stateId: true,
      game: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
    skip: params.skip,
    take: params.take || 24,
    orderBy: {
      createdAt: "desc",
    },
  });
  return changeLogs;
};

export default {
  path: "get",
  handler: handler,
  needsAuth: true,
};
