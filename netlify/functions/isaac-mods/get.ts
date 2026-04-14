import { CustomHandler } from "../../types";

const getHandler: CustomHandler<"isaac-mods/get"> = async (prisma, params) => {
  const filterItems = params.filter?.includes("items");
  const filterEnemies = params.filter?.includes("enemies");
  const filterQoL = params.filter?.includes("qol");

  const mods = await prisma.isaacMod.findMany({
    where: {
      appid: params.appId,
      playedAt:
        params.playedAt === true
          ? {
              not: null,
            }
          : params.playedAt === false
            ? {
                equals: null,
              }
            : undefined,
      playableContents: params.contentType
        ? {
            some: {
              type: params.contentType,
            },
          }
        : undefined,
      isEnemies: filterEnemies,
      isQoL: filterQoL,
      items: filterItems ? { gt: 0 } : undefined,
    },
    skip: params.skip,
    take: params.take,
    orderBy: params.sortDirection
      ? {
          playedAt: params.sortDirection,
        }
      : undefined,
    include: {
      playableContents: true,
    },
  });
  return mods;
};

export default {
  path: "get",
  handler: getHandler,
  needsAuth: false,
};
