import { CustomHandler } from "../../types";

const searchHandler: CustomHandler<"words/search"> = async (prisma, params) => {
  const memos = await prisma.word.findMany({
    where: {
      value: {
        mode: "insensitive",
        contains: params.search,
      },
    },
    orderBy: { value: "asc" },
    select: {
      id: true,
      value: true,
      nextPractice: true,
    },
    take: 5,
  });
  return memos;
};

export default {
  path: "search",
  handler: searchHandler,
  needsAuth: true,
};
