import { CustomHandler } from "../../types";

const searchHandler: CustomHandler<"factorio-mods/search"> = async (
  prisma,
  params,
) => {
  return prisma.factorioMod.findMany({
    where: {
      id: params.id,
      name: params.search
        ? { contains: params.search, mode: "insensitive" }
        : undefined,
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    take: 5,
  });
};

export default { path: "search", handler: searchHandler, needsAuth: true };
