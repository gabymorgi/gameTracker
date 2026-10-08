import { CustomHandler } from "../../types";
import { bookChangelogsInclude } from "../../../src/ts/api/books";

const handler: CustomHandler<"books/get"> = async (prisma, params) => {
  const books = await prisma.book.findMany({
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" }
        : undefined,
      state: params.state,
      start: params.start ? { gte: new Date(params.start) } : undefined,
      end: params.end ? { lte: new Date(params.end) } : undefined,
      language: params.language,
    },
    include: bookChangelogsInclude,
    skip: params.skip,
    take: params.take || 24,
    orderBy: {
      [params.sortBy || "end"]: params.sortDirection || "desc",
    },
  });
  return books;
};

export default {
  path: "get",
  handler: handler,
  needsAuth: false,
};
