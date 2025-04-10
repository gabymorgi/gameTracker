import { CustomHandler } from "../../types";
import { subMonths } from "date-fns";

const handler: CustomHandler<"games/drop"> = async (prisma) => {
  const gamesToUpdate = await prisma.game.findMany({
    where: {
      state: "PLAYING",
      end: { lte: subMonths(new Date(), 1) },
    },
    select: { id: true, name: true },
  });
  await prisma.game.updateMany({
    where: { id: { in: gamesToUpdate.map((game) => game.id) } },
    data: { state: "DROPPED" },
  });
  await prisma.changelog.updateMany({
    where: {
      state: "PLAYING",
      gameId: {
        in: gamesToUpdate.map((game) => game.id),
      },
    },
    data: { state: "DROPPED" },
  });
  return { updateGames: gamesToUpdate };
};

export default {
  path: "drop",
  handler: handler,
  needsAuth: true,
};
