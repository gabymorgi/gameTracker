import { CustomHandler } from "../../types";

interface Params {
  search?: string;
  id?: string;
}

const searchHandler: CustomHandler = async (prisma, params: Params) => {
  const games = await prisma.game.findMany({
    where: {
      id: params.id,
      name: params.search
        ? {
            mode: "insensitive",
            contains: params.search,
          }
        : undefined,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
    take: 5,
  });
  return games;
};

export default {
  path: "search",
  handler: searchHandler,
  needsAuth: false,
};
