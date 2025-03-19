import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"isaac-mods/delete"> = async (
  prisma,
  params,
) => {
  const deletedGame = await prisma.isaacMod.delete({
    where: { id: params.id },
  });
  return deletedGame;
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
