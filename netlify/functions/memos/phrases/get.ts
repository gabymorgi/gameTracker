import { CustomHandler } from "../../../types";

const getHandler: CustomHandler = async (prisma) => {
  const phrases = await prisma.phrase.findMany({
    where: {
      wordPhrases: {
        none: {},
      },
    },
    take: 6,
  });
  return phrases;
};

export default {
  path: "phrases/get",
  handler: getHandler,
  needsAuth: false,
};
