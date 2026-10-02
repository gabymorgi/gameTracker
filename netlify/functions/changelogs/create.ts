import { CustomHandler } from "../../types";

const handler: CustomHandler<"changelogs/create"> = async (prisma, params) => {
  return await prisma.$transaction(async (tx) => {
    const changelog = await tx.changelog.create({
      data: {
        createdAt: params.createdAt,
        achievements: params.achievements,
        playedTime: params.playedTime,
        game: {
          connect: {
            id: params.gameId,
          },
        },
        state: params.state,
      },
    });

    const latestChangelog = await tx.changelog.findFirst({
      where: { gameId: changelog.gameId },
      orderBy: [{ createdAt: "desc" }],
      select: { state: true },
    });

    await tx.game.update({
      where: { id: params.gameId },
      data: {
        playedTime: { increment: params.playedTime },
        obtainedAchievements: { increment: params.achievements },
        state: latestChangelog?.state,
      },
    });

    return changelog;
  });
};

export default {
  path: "create",
  handler: handler,
  needsAuth: true,
};
