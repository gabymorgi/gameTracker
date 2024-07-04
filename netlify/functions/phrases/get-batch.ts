import { CustomHandler } from "../../types";

const handler: CustomHandler = async (prisma) => {
  const phrases = await prisma.phrase.findMany({
    where: {
      translation: null,
      wordPhrases: {
        some: {
          word: {
            pronunciation: {
              not: null,
            },
          },
        },
      },
    },
    select: {
      id: true,
      content: true,
    },
    take: 1000,
  });
  return phrases;
};

export default {
  path: "get-batch",
  handler: handler,
  needsAuth: true,
};
