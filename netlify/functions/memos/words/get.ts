import { CustomHandler } from "../../../types";

interface Params {
  limit?: string;
  excludeCompleted?: string;
}

const getHandler: CustomHandler = async (prisma, _, params: Params) => {
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

  const parsed = memos.map((memo) => {
    const cleanMemo: any = memo;
    cleanMemo.word = memo.value;
    delete cleanMemo.value;
    cleanMemo.phrases = memo.wordPhrases.map((wordPhrase) => wordPhrase.phrase);
    delete cleanMemo.wordPhrases;
    return cleanMemo;
  });

  return parsed;
};

export default {
  path: "words/get",
  handler: getHandler,
  needsAuth: true,
};
