import { CustomHandler } from "../../types";

interface Params {
  ids: string[];
}

const handler: CustomHandler = async (prisma, params: Params) => {
  const wordPhrases = await prisma.wordPhrase.deleteMany({
    where: {
      phraseId: {
        in: params.ids,
      },
    },
  });
  const phrases = await prisma.phrase.deleteMany({
    where: {
      id: {
        in: params.ids,
      },
    },
  });

  return { wordPhrases, phrases };
};

export default {
  path: "delete-batch",
  handler: handler,
  needsAuth: true,
};
