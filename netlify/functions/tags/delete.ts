import { CustomHandler } from "../../types";
import { CustomError } from "../../utils/error";

const deleteHandler: CustomHandler<"tags/delete"> = async (prisma, params) => {
  const gamesUsingTag = await prisma.game.count({
    where: { tags: { has: params.id } },
  });
  if (gamesUsingTag > 0) {
    throw new CustomError("Tag is still in use by one or more games", 409);
  }

  const deletedTag = await prisma.tag.delete({
    where: { id: params.id },
  });
  return deletedTag;
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
