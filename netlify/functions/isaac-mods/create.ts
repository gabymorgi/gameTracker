import { CustomHandler } from "../../types";

const createHandler: CustomHandler<"isaac-mods/create"> = async (
  prisma,
  mod,
) => {
  const createdMod = await prisma.isaacMod.create({
    data: {
      appid: mod.appid,
      name: mod.name,
      extra: mod.extra,
      isEnemies: mod.isEnemies,
      isQoL: mod.isQoL,
      items: mod.items,
      playedAt: mod.playedAt,
      wiki: mod.wiki,
      playableContents: mod.playableContents
        ? {
            createMany: {
              data: mod.playableContents.create.map((changelog) => ({
                name: changelog.name,
                description: changelog.description,
                review: changelog.review,
                mark: changelog.mark,
                type: changelog.type,
              })),
            },
          }
        : undefined,
    },
    include: {
      playableContents: true,
    },
  });

  return createdMod;
};

export default {
  path: "create",
  handler: createHandler,
  needsAuth: true,
};
