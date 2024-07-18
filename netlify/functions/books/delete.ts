import { CustomHandler } from "../../types";

interface UrlParams {
  id: string;
}

const handler: CustomHandler = async (prisma, urlParams: UrlParams) => {
  const deletedBook = await prisma.book.delete({
    where: { id: urlParams.id },
  });
  return deletedBook;
};

export default {
  path: "delete",
  handler: handler,
  needsAuth: true,
};
