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
  const changeLogs = await prisma.changeLog.findMany({
    where: {
      gameId: params?.gameId || undefined,
      createdAt: {
        gte: params?.startDate ? params.startDate : undefined,
        lte: params?.endDate ? params.endDate : undefined,
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
    skip: pageSize * (pageNumber - 1),
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
  return changeLogs;
};

export default {
  path: "get",
  handler: getHandler,
  needsAuth: true,
};
