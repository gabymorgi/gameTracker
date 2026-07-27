import { GameState } from "#prisma-client";
import { CustomHandler } from "../../types";
import { formatGame } from "../../utils/format";
import { selectChangelog } from "./utils";

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
    select: selectChangelog,
  });
  return {
    ...changelog,
    game: formatGame(changelog.game),
  };
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
