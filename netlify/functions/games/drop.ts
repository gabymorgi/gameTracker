import { CustomHandler } from "../../types";
import { subMonths } from "date-fns";

const handler: CustomHandler = async (prisma) => {
  const gamesToUpdate = await prisma.game.findMany({
    where: {
      state: "PLAYING",
      end: { lte: subMonths(new Date(), 1) },
    },
    select: { id: true },
  });
  const updateGames = await prisma.game.updateMany({
    where: { id: { in: gamesToUpdate.map((game) => game.id) } },
    data: { state: "DROPPED" },
  });
  const updatedChangelog = await prisma.changeLog.updateMany({
    where: {
      state: "PLAYING",
      gameId: {
        in: gamesToUpdate.map((game) => game.id),
      },
    },
    data: { state: "DROPPED" },
  });
  return { updateGames, updatedChangelog };
};

export default {
  path: "drop",
  handler: handler,
  needsAuth: true,
};
