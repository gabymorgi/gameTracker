import { CustomHandler } from "../../types";
import { subMonths } from "date-fns";

const handler: CustomHandler<"games/drop"> = async (prisma) => {
  const gamesToUpdate = await prisma.game.findMany({
    where: {
      stateId: "Playing",
      end: { lte: subMonths(new Date(), 1) },
    },
    select: { id: true },
  });
  const updateGames = await prisma.game.updateMany({
    where: { id: { in: gamesToUpdate.map((game) => game.id) } },
    data: { stateId: "Dropped" },
  });
  const updatedChangelog = await prisma.changeLog.updateMany({
    where: {
      stateId: "Playing",
      gameId: {
        in: gamesToUpdate.map((game) => game.id),
      },
    },
    data: { stateId: "Dropped" },
  });
  return { updateGames, updatedChangelog };
};

export default {
  path: "drop",
  handler: handler,
  needsAuth: true,
};
