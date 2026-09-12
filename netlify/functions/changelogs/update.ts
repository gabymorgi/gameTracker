import { CustomHandler } from "../../types";

const updateHandler: CustomHandler<"changelogs/update"> = async (
  prisma,
  params,
) => {
  const changelog = await prisma.changelog.update({
    where: {
      id: params.id,
    },
    data: {
      createdAt: params.createdAt || undefined,
      achievements: params.achievements ?? undefined,
      hours: params.hours ?? undefined,
      game: params.gameId
        ? {
            connect: {
              id: params.gameId,
            },
          }
        : undefined,
      state: params.state,
    },
  });
  return changelog;
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
