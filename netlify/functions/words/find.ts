import { CustomHandler } from "../../types";

interface UrlParams {
  id: string;
}

const findHandler: CustomHandler = async (prisma, urlParams: UrlParams) => {
  const word = await prisma.word.findFirst({
    where: {
      id: urlParams.id,
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
  // const word = await prisma.word.findMany({
  //   where: {
  //     priority: 0,
  //   },
  // });

  // return word;
};

export default {
  path: "find",
  handler: findHandler,
  needsAuth: false,
};
