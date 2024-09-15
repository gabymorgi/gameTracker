import { CustomHandler } from "../../types";

const handler: CustomHandler<"words/get"> = async (prisma, params) => {
  const memos = await prisma.word.findMany({
    where: {
      value: params.filterValues
        ? {
            notIn: params.filterValues,
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
      phrases: true,
    },
    orderBy: [
      {
        priority: "desc",
      },
      {
        id: "asc",
      },
    ],
    take: params.take || 24,
  });

  return memos;
};

export default {
  path: "get",
  handler: handler,
  needsAuth: true,
};
