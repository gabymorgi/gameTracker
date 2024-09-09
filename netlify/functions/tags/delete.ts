import { CustomHandler } from "../../types";

interface Params {
  id: string;
}

const deleteHandler: CustomHandler<Params> = async (prisma, params) => {
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
