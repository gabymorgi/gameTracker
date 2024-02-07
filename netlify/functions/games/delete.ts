import { CustomHandler } from "../../types";

interface UrlParams {
  id: string;
}

const deleteHandler: CustomHandler = async (prisma, urlParams: UrlParams) => {
  const deletedGame = await prisma.game.delete({
    where: { id: urlParams.id },
  });
  return deletedGame;
};

export default {
  path: "delete/:id",
  handler: deleteHandler,
  needsAuth: true,
};
