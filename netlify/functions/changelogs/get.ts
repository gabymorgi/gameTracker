import { CustomHandler } from "../../types";
import { selectChangelog } from "./utils";

const handler: CustomHandler<"changelogs/get"> = async (prisma, params) => {
  const changelogs = await prisma.changelog.findMany({
    where: {
      gameId: params.gameId || undefined,
      createdAt: {
        gte: params.from,
        lte: params.to,
      },
    },
    select: selectChangelog,
    skip: params.skip,
    take: params.take || 24,
    orderBy: {
      createdAt: "desc",
    },
  });
  return changelogs;
};

export default {
  path: "get",
  handler: handler,
  needsAuth: true,
};
