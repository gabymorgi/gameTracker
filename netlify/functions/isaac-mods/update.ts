import { Prisma } from "@prisma/client";
import { $SafeAny, CustomHandler } from "../../types";

const updateHandler: CustomHandler<"isaac-mods/update"> = async (
  prisma,
  mod,
) => {
  if (mod.playableContents) {
    const transactions: Prisma.PrismaPromise<$SafeAny>[] = [];
    if (mod.playableContents.create.length > 0) {
      transactions.push(
        prisma.isaacPlayableContent.createMany({
          data: mod.playableContents.create.map((changelog) => ({
            name: changelog.name,
            description: changelog.description,
            review: changelog.review,
            mark: changelog.mark,
            type: changelog.type,
            modId: mod.id!,
          })),
        }),
      );
    }
    if (mod.playableContents.update.length > 0) {
      for (const changelog of mod.playableContents.update) {
        transactions.push(
          prisma.isaacPlayableContent.update({
            where: { id: changelog.id },
            data: {
              name: changelog.name,
              description: changelog.description,
              review: changelog.review,
              mark: changelog.mark,
              type: changelog.type,
            },
          }),
        );
      }
    }
    if (mod.playableContents.delete.length > 0) {
      transactions.push(
        prisma.isaacPlayableContent.deleteMany({
          where: {
            id: {
              in: mod.playableContents.delete,
            },
          },
        }),
      );
    }
    await prisma.$transaction(transactions);
  }

  if (
    [
      "appid",
      "name",
      "wiki",
      "items",
      "extra",
      "playedAt",
      "isQoL",
      "isEnemies",
    ].some((key) => mod.hasOwnProperty(key))
  ) {
    const updateGame = await prisma.isaacMod.update({
      where: { id: mod.id },
      data: {
        appid: mod.appid,
        name: mod.name,
        wiki: mod.wiki,
        items: mod.items,
        extra: mod.extra,
        playedAt: mod.playedAt,
        isQoL: mod.isQoL,
        isEnemies: mod.isEnemies,
      },
      include: { playableContents: true },
    });
    return updateGame;
  } else {
    const updateGame = await prisma.isaacMod.findFirstOrThrow({
      where: { id: mod.id },
      include: { playableContents: true },
    });
    return updateGame;
  }
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
