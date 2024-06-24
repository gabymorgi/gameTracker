import { CustomHandler } from "../../types";

export interface ChangelogI {
  id: string;
  achievements: number;
  createdAt: string;
  gameId: string;
  hours: number;
  stateId: string;
}

const deleteHandler: CustomHandler = async (prisma, params: ChangelogI) => {
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
      state: {
        connect: {
          id: params.stateId,
        },
      },
    },
  });

  return changelog;
};

export default {
  path: "create",
  handler: deleteHandler,
  needsAuth: true,
};
