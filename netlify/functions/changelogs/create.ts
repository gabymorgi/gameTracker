import { GameState } from "@prisma/client";
import { CustomHandler } from "../../types";

export interface ChangelogI {
  id: string;
  achievements: number;
  createdAt: string;
  gameId: string;
  hours: number;
  state: string;
}

const handler: CustomHandler = async (prisma, params: ChangelogI) => {
  const changelog = await prisma.changeLog.create({
    data: {
      createdAt: params.createdAt,
      achievements: params.achievements,
      hours: params.hours,
      game: {
        connect: {
          id: params.gameId,
        },
      },
      state: params.state as GameState,
    },
  });

  return changelog;
};

export default {
  path: "create",
  handler: handler,
  needsAuth: true,
};
