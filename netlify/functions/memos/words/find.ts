import { CustomHandler } from "../../../types";

interface UrlParams {
  value: string;
}

const findHandler: CustomHandler = async (prisma, urlParams: UrlParams) => {
  const word = await prisma.word.findFirst({
    where: {
      value: urlParams.value,
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
    take: 5,
  });
  return word || {};
};

export default {
  path: "words/find/:value",
  handler: findHandler,
  needsAuth: false,
};
