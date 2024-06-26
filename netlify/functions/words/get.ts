import { CustomHandler } from "../../types";

interface Params {
  limit?: string;
  excludeCompleted?: string;
}

const getHandler: CustomHandler = async (prisma, params: Params) => {
  const memos = await prisma.word.findMany({
    where: {
      nextPractice: {
        lt: new Date(),
      },
      definition: params.excludeCompleted
        ? {
            equals: null,
          }
        : undefined,
    },
    include: {
      wordPhrases: {
        select: {
          phrase: {
            select: {
              id: true,
              content: true,
              translation: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        priority: "desc",
      },
      {
        nextPractice: "asc",
      },
      {
        id: "asc",
      },
    ],
    take: params.limit ? Number(params.limit) : 24,
  });

  return memos;
};

export default {
  path: "get",
  handler: getHandler,
  needsAuth: true,
};
