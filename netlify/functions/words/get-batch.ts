import { CustomHandler } from "../../types";

const handler: CustomHandler = async (prisma) => {
  const memos = await prisma.word.findMany({
    where: {
      definition: {
        equals: null,
      },
    },
    select: {
      id: true,
      value: true,
      wordPhrases: {
        where: {
          phrase: {
            translation: {
              equals: null,
            },
          },
        },
        select: {
          phrase: {
            select: {
              id: true,
              content: true,
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
    take: 3000,
  });

  return memos;
};

export default {
  path: "get-batch",
  handler: handler,
  needsAuth: true,
};
