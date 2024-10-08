import { CustomHandler } from "../../types";

const getGameTagHandler: CustomHandler<"tags/getGameTags"> = async (prisma) => {
  const gameTags = await prisma.gameTag.findMany();
  return gameTags;
};

export default {
  path: "getGameTags",
  handler: getGameTagHandler,
  needsAuth: true,
};
