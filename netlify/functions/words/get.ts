import { CustomHandler } from "../../types";

interface Params {
  filterValues?: string;
  limit?: string;
  excludeCompleted?: string;
}

const handler: CustomHandler = async (prisma, params: Params) => {
  const filterValues = params.filterValues?.split(",");
  const memos = await prisma.word.findMany({
    where: {
      value: filterValues
        ? {
            notIn: filterValues,
          }
        : undefined,
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
        id: "asc",
      },
    ],
    take: params.limit ? Number(params.limit) : 24,
  });

  return memos;
};

export default {
  path: "get",
  handler: handler,
  needsAuth: true,
};
