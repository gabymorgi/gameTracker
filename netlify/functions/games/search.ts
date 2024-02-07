import { CustomHandler } from "../../types";

interface Params {
  search: string;
}

const searchHandler: CustomHandler = async (prisma, _, params: Params) => {
  const games = await prisma.game.findMany({
    where: {
      name: {
        mode: "insensitive",
        contains: params.search,
      },
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
