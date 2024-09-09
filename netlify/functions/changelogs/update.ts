import { GameState } from "@prisma/client";
import { CustomHandler } from "../../types";

const updateHandler: CustomHandler<"changelogs/update"> = async (
  prisma,
  params,
) => {
  const changelog = await prisma.changeLog.update({
    where: {
      id: params.id,
    },
    data: {
      createdAt: params.createdAt || undefined,
      achievements: params.achievements
        ? Number(params.achievements)
        : undefined,
      hours: params.hours ? Number(params.hours) : undefined,
      game: params.gameId
        ? {
            connect: {
              id: params.gameId,
            },
          }
        : undefined,
      state: params.state as GameState,
    },
  });
  return changelog;
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
