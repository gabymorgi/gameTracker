import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"words/delete"> = async (
  prisma,
  urlParams,
) => {
  const word = await prisma.word.delete({
    where: {
      id: urlParams.id,
    },
  });
  return word;
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
