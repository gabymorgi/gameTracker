import { CustomHandler } from "../../../types";

interface Params {
  value: string;
}

const searchHandler: CustomHandler = async (prisma, _, params: Params) => {
  const memos = await prisma.word.findMany({
    where: {
      value: {
        contains: params.value,
      },
    },
    select: {
      id: true,
      value: true,
    },
    take: 5,
  });
  return memos;
};

export default {
  path: "words/search",
  handler: searchHandler,
  needsAuth: true,
};
