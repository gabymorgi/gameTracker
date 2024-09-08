import { CustomHandler } from "../../types";

const handler: CustomHandler<"books/delete"> = async (prisma, params) => {
  const deletedBook = await prisma.book.delete({
    where: { id: params.id },
  });
  return deletedBook;
};

export default {
  path: "delete",
  handler: handler,
  needsAuth: true,
};
