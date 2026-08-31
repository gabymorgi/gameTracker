import { Prisma } from "#prisma-client";
import { $SafeAny, CustomHandler } from "../../types";

const updateHandler: CustomHandler<"isaac-mods/update"> = async (
  prisma,
  mod,
) => {
  const playableContentOps: Prisma.PrismaPromise<$SafeAny>[] = [];
  if (mod.playableContents) {
    if (mod.playableContents.create.length > 0) {
      playableContentOps.push(
        prisma.isaacPlayableContent.createMany({
          data: mod.playableContents.create.map((content) => ({
            name: content.name,
            description: content.description,
            review: content.review,
            mark: content.mark,
            type: content.type,
            modId: mod.id!,
          })),
        }),
      );
    }
    if (mod.playableContents.update.length > 0) {
      for (const content of mod.playableContents.update) {
        playableContentOps.push(
          prisma.isaacPlayableContent.update({
            where: { id: content.id },
            data: {
              name: content.name,
              description: content.description,
              review: content.review,
              mark: content.mark,
              type: content.type,
            },
          }),
        );
      }
    }
    if (mod.playableContents.delete.length > 0) {
      playableContentOps.push(
        prisma.isaacPlayableContent.deleteMany({
          where: { id: { in: mod.playableContents.delete } },
        }),
      );
    }
  }

  if (playableContentOps.length > 0)
    await prisma.$transaction(playableContentOps);

  const modData = {
    appid: mod.appid,
    name: mod.name,
    wiki: mod.wiki,
    items: mod.items,
    extra: mod.extra,
    playedAt: mod.playedAt,
    isQoL: mod.isQoL,
    isEnemies: mod.isEnemies,
  };

  if (Object.values(modData).some((v) => v !== undefined)) {
    const updatedMod = await prisma.isaacMod.update({
      where: { id: mod.id },
      data: modData,
      include: { playableContents: true },
    });
    return updatedMod;
  } else {
    const updatedMod = await prisma.isaacMod.findFirstOrThrow({
      where: { id: mod.id },
      include: { playableContents: true },
    });
    return updatedMod;
  }
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
