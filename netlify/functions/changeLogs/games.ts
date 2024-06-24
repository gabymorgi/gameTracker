import { CustomHandler } from "../../types";

interface Params {
  startDate: string;
  endDate: string;
  pageSize: string;
  pageNumber: string;
  gameId: string;
}

const getHandler: CustomHandler = async (prisma, params: Params) => {
  const pageSize = params?.pageSize ? parseInt(params.pageSize) : 20;
  const pageNumber = params?.pageNumber ? parseInt(params.pageNumber) : 1;
  const changeLogs = await prisma.game.findMany({
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
    skip: pageSize * (pageNumber - 1),
    take: pageSize,
    orderBy: {
      end: "desc",
    },
  });
  return changeLogs;
};

export default {
  path: "games",
  handler: getHandler,
  needsAuth: true,
};
