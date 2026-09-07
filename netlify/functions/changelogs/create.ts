import { CustomHandler } from "../../types";
import { selectChangelog } from "./utils";

export interface ChangelogI {
  id: string;
  achievements: number;
  createdAt: string;
  gameId: string;
  hours: number;
  state: string;
}

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
    select: selectChangelog,
  });

  return changelog;
};

export default {
  path: "create",
  handler: handler,
  needsAuth: true,
};
