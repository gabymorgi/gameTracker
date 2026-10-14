import { CustomHandler } from "../../types";

const getHandler: CustomHandler<"factorio-mods/get"> = async (
  prisma,
  params,
) => {
  return prisma.factorioMod.findMany({
    skip: params.skip,
    take: params.take,
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" as const }
        : undefined,
      type: params.type || undefined,
      playedAt:
        params.playedAt === true
          ? { not: null }
          : params.playedAt === false
            ? { null: true }
            : undefined,
      dependedOnBy: params.hideModsWithDependencies ? { none: {} } : undefined,
    },
    orderBy: [{ mark: "desc" }, { id: "asc" }],
    include: {
      dependencies: {
        orderBy: { mark: "desc" },
      },
    },
  });
};

export default {
  path: "get",
  handler: getHandler,
  needsAuth: true,
};
