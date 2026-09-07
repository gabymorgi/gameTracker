import { CustomHandler } from "../../types";

const ostsHandler: CustomHandler<"games/getOsts"> = async (prisma) => {
  const games = await prisma.game.findMany({
    where: {
      ost: { not: null },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      ost: true,
    },
  });

  return games as { id: string; name: string; imageUrl: string; ost: string }[];
};

export default {
  path: "osts",
  handler: ostsHandler,
  needsAuth: false,
};
