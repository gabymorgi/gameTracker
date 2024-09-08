import { CustomHandler } from "../../types";

const handler: CustomHandler<"words/get"> = async (prisma, params) => {
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
    take: params.take || 24,
  });

  return memos.map((memo) => ({
    ...memo,
    phrases: memo.wordPhrases.map((wordPhrase) => ({
      id: wordPhrase.phrase.id,
      content: wordPhrase.phrase.content,
      translation: wordPhrase.phrase.translation,
    })),
  }));
};

export default {
  path: "get",
  handler: handler,
  needsAuth: true,
};
