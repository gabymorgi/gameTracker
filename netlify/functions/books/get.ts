import { BookState } from "@prisma/client";
import { CustomHandler } from "../../types";

interface Params {
  page?: string;
  pageSize?: string;
  name?: string;
  start?: string;
  end?: string;
  state?: string;
  sortBy?: string;
  sortDirection?: string;
}

const handler: CustomHandler = async (prisma, params: Params) => {
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 20;
  const page = params.page ? parseInt(params.page) : 1;

  const books = await prisma.book.findMany({
    where: {
      name: params.name
        ? { contains: params.name, mode: "insensitive" }
        : undefined,
      state: params.state as BookState,
      start: params.start ? { gte: params.start } : undefined,
      end: params.end ? { lte: params.end } : undefined,
    },
    skip: pageSize * (page - 1),
    take: pageSize,
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
