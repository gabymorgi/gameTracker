import { CustomHandler } from "../../types";

interface Params {
  page?: string;
  pageSize?: string;
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
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 20;
  const page = params.page ? parseInt(params.page) : 1;

  const games = await prisma.game.findMany({
    where: {
      name: params.name ? { contains: params.name } : undefined,
      stateId: params.state || undefined,
      gameTags: params.tags
        ? { some: { tagId: { in: params.tags.split(",") } } }
        : undefined,
      start: params.start ? { gte: params.start } : undefined,
      end: params.end ? { lte: params.end } : undefined,
      appid: params.appids
        ? { in: params.appids.split(",").map((id) => Number(id)) }
        : undefined,
    },
    include: {
      score: {
        include: {
          extras: true,
        },
      },
      gameTags: true,
      changeLogs: params.includeChangeLogs === "true",
    },
    skip: pageSize * (page - 1),
    take: pageSize,
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
