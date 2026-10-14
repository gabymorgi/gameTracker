import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"factorio-mods/delete"> = async (
  prisma,
  params,
) => {
  return prisma.factorioMod.delete({ where: { id: params.id } });
};

export default { path: "delete", handler: deleteHandler, needsAuth: true };
