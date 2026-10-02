import { CustomHandler } from "../../types";

const updateHandler: CustomHandler<"changelogs/update"> = async (
  prisma,
  params,
) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.changelog.findUniqueOrThrow({
      where: { id: params.id },
      select: { gameId: true, playedTime: true, achievements: true },
    });

    const changelog = await tx.changelog.update({
      where: {
        id: params.id,
      },
      data: {
        createdAt: params.createdAt || undefined,
        achievements: params.achievements ?? undefined,
        playedTime: params.playedTime ?? undefined,
        state: params.state,
      },
    });

    const latestChangelog = await tx.changelog.findFirst({
      where: { gameId: changelog.gameId },
      orderBy: [{ createdAt: "desc" }],
      select: { state: true },
    });

    await tx.game.update({
      where: { id: changelog.gameId },
      data: {
        playedTime: {
          increment: changelog.playedTime - existing.playedTime,
        },
        obtainedAchievements: {
          increment: changelog.achievements - existing.achievements,
        },
        state: latestChangelog?.state,
      },
    });

    return changelog;
  });
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
