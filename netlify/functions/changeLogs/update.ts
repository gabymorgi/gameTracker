import { CustomHandler } from "../../types";

export interface ChangelogI {
  id: string;
  achievements: string;
  createdAt: string;
  gameId: string;
  gameName: string;
  hours: number;
  stateId: string;
}

interface UrlParams {
  id: string;
}

const updateHandler: CustomHandler = async (
  prisma,
  urlParams: UrlParams,
  params: ChangelogI,
) => {
  const changelog = await prisma.changeLog.update({
    where: {
      id: params?.id,
    },
    data: {
      createdAt: params.createdAt ? Number(params.createdAt) : undefined,
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
      state: params.stateId
        ? {
            connect: {
              id: params.stateId,
            },
          }
        : undefined,
    },
  });
  return changelog;
};

export default {
  path: "update/:id",
  handler: updateHandler,
  needsAuth: true,
};
