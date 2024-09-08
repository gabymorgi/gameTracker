import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"tags/delete"> = async (prisma, params) => {
  const deletedTag = await prisma.tags.delete({
    where: { id: params.id },
  });
  return deletedTag;
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
