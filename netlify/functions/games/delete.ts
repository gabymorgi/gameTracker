import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"games/delete"> = async (prisma, params) => {
  const deletedGame = await prisma.game.delete({
    where: { id: params.id },
  });
  return deletedGame;
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
