import { GameState } from "@prisma/client";
import { CustomHandler } from "../../types";

interface Params {
  pageSize: string;
  pageNumber: string;
  gameId: string;
  name?: string;
  start?: string;
  end?: string;
  state?: string;
  tags?: string;
  appids?: string;
  sortBy?: string;
  sortDirection?: string;
  includeChangeLogs?: string;
}

const getHandler: CustomHandler = async (prisma, params: Params) => {
  const pageSize = params?.pageSize ? parseInt(params.pageSize) : 20;
  const pageNumber = params?.pageNumber ? parseInt(params.pageNumber) : 1;
  const changeLogs = await prisma.game.findMany({
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" }
        : undefined,
      state: params.state as GameState,
      gameTags: params.tags
        ? { some: { tagId: { in: params.tags.split(",") } } }
        : undefined,
      start: params.start ? { gte: new Date(params.start) } : undefined,
      end: params.end ? { lte: new Date(params.end) } : undefined,
      appid: params.appids
        ? { in: params.appids.split(",").map((id) => Number(id)) }
        : undefined,
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
          state: true,
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
