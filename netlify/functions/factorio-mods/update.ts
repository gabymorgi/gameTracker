import { CustomHandler } from "../../types";

const updateHandler: CustomHandler<"factorio-mods/update"> = async (
  prisma,
  mod,
) => {
  return prisma.factorioMod.update({
    where: { id: mod.id },
    data: {
      name: mod.name,
      link: mod.link,
      description: mod.description,
      review: mod.review,
      mark: mod.mark,
      type: mod.type,
      requirements: mod.requirements,
      playedAt: mod.playedAt,
      dependencies: mod.dependencyIds
        ? {
            set: mod.dependencyIds
              .filter((id) => id !== mod.id)
              .map((id) => ({ id })),
          }
        : undefined,
    },
    include: { dependencies: { orderBy: { mark: "desc" } } },
  });
};

export default { path: "update", handler: updateHandler, needsAuth: true };
