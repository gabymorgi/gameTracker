import { CustomHandler } from "../../types";

interface UrlParams {
  id: string;
}

const deleteHandler: CustomHandler = async (prisma, urlParams: UrlParams) => {
  const wordPhrases = await prisma.wordPhrase.deleteMany({
    where: {
      phraseId: urlParams.id,
    },
  });
  const phrases = await prisma.phrase.delete({
    where: {
      id: urlParams.id,
    },
  });
  return {
    wordPhrases,
    phrases,
  };
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
