import { CustomHandler } from "../../types";

const createHandler: CustomHandler<"factorio-mods/create"> = async (
  prisma,
  mod,
) => {
  return prisma.factorioMod.create({
    data: {
      name: mod.name,
      link: mod.link,
      description: mod.description,
      review: mod.review,
      mark: mod.mark,
      type: mod.type,
      requirements: mod.requirements,
      playedAt: mod.playedAt,
      dependencies: { connect: mod.dependencyIds?.map((id) => ({ id })) },
    },
    include: { dependencies: { orderBy: { mark: "desc" } } },
  });
};

export default { path: "create", handler: createHandler, needsAuth: true };
