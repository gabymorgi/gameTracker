import { CustomHandler } from "../../types";

const getHandler: CustomHandler<"isaac-mods/get"> = async (prisma, params) => {
  const filterNotPlayed = params.filter?.includes("not-played");
  const filterCharacters = params.filter?.includes("characters");
  const filterChallenges = params.filter?.includes("challenges");
  const filterItems = params.filter?.includes("items");
  const filterEnemies = params.filter?.includes("enemies");
  const filterQoL = params.filter?.includes("qol");
  const filterContent = filterChallenges || filterCharacters;

  const mods = await prisma.isaacMod.findMany({
    where: {
      appid: params.appId,
      playedAt: filterNotPlayed
        ? {
            equals: null,
          }
        : undefined,
      playableContents: filterContent
        ? {
            some: {
              type: filterCharacters
                ? "CHARACTER"
                : filterChallenges
                  ? "CHALLENGE"
                  : undefined,
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
