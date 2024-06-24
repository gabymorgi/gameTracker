import { CustomHandler } from "../../types";

interface Params {
  value: string;
}

const searchHandler: CustomHandler = async (prisma, params: Params) => {
  const memos = await prisma.word.findMany({
    where: {
      value: {
        contains: params.value,
      },
    },
    orderBy: { value: "asc" },
    select: {
      id: true,
      value: true,
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
