import { CustomHandler } from "../../types";

const handler: CustomHandler<"changelogs/create"> = async (prisma, params) => {
  const changelog = await prisma.changelog.create({
    data: {
      createdAt: params.createdAt,
      achievements: params.achievements,
      hours: params.hours,
      game: {
        connect: {
          id: params.gameId,
        },
      },
      state: params.state,
    },
  });

  return changelog;
};

export default {
  path: "create",
  handler: handler,
  needsAuth: true,
};
