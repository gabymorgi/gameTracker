import { GameState } from "@prisma/client";
import { CustomHandler } from "../../types";

export interface ChangelogI {
  id: string;
  achievements: string;
  createdAt: string;
  gameId: string;
  gameName: string;
  hours: number;
  state: string;
}

const updateHandler: CustomHandler = async (prisma, params: ChangelogI) => {
  const changelog = await prisma.changeLog.update({
    where: {
      id: params?.id,
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
