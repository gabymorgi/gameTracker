import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"changelogs/delete"> = async (
  prisma,
  params,
) => {
  return await prisma.$transaction(async (tx) => {
    const deletedChangelog = await tx.changelog.delete({
      where: { id: params.id },
    });

    const latestChangelog = await tx.changelog.findFirst({
      where: { gameId: deletedChangelog.gameId },
      orderBy: [{ createdAt: "desc" }],
      select: { state: true },
    });

    await tx.game.update({
      where: { id: deletedChangelog.gameId },
      data: {
        playedTime: { decrement: deletedChangelog.playedTime },
        obtainedAchievements: { decrement: deletedChangelog.achievements },
        state: latestChangelog?.state,
      },
    });

    return deletedChangelog;
  });
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
