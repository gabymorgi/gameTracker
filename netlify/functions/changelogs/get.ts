import { CustomHandler } from "../../types";
import { formatGame } from "../../utils/format";
import { selectChangelog } from "./utils";

const handler: CustomHandler<"changelogs/get"> = async (prisma, params) => {
  const changelogs = await prisma.changelog.findMany({
    where: {
      gameId: params.gameId || undefined,
      game: params.name
        ? {
            name: {
              contains: params.name,
              mode: "insensitive",
            },
          }
        : undefined,
      createdAt: {
        gte: params.from,
        lte: params.to,
      },
    },
    select: selectChangelog,
    skip: params.skip,
    take: params.take || 24,
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "asc",
      },
    ],
  });
  return changelogs.map((changelog) => ({
    ...changelog,
    game: formatGame(changelog.game),
  }));
};

export default {
  path: "get",
  handler: handler,
  needsAuth: false,
};
