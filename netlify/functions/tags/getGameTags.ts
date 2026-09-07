import { CustomHandler } from "../../types";

const getGameTagHandler: CustomHandler<"tags/getGameTags"> = async (prisma) => {
  const games = await prisma.game.findMany({
    select: { id: true, tags: true },
  });
  return games;
};

export default {
  path: "getGameTags",
  handler: getGameTagHandler,
  needsAuth: true,
};
