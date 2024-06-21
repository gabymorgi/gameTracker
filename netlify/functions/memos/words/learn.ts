import { CustomHandler } from "../../../types";

interface UrlParams {
  id: string;
}

const learnHandler: CustomHandler = async (prisma, urlParams: UrlParams) => {
  const word = await prisma.word.update({
    where: { id: urlParams.id },
    data: {
      priority: -1,
      practiceListening: 1,
      practicePhrase: 1,
      practicePronunciation: 1,
      practiceTranslation: 1,
      practiceWord: 1,
    },
  });

  // Delete all phrases related to the word
  const phrasesToDelete = await prisma.phrase.findMany({
    where: {
      wordPhrases: {
        some: {
          wordId: urlParams.id,
        },
      },
    },
    select: {
      id: true,
    },
  });
  const wordPhrases = await prisma.wordPhrase.deleteMany({
    where: {
      wordId: urlParams.id,
    },
  });
  const phrases = await prisma.phrase.deleteMany({
    where: {
      id: {
        in: phrasesToDelete.map((phrase) => phrase.id),
      },
    },
  });
  return {
    word,
    wordPhrases,
    phrases,
  };
};

export default {
  path: "words/learn/:id",
  handler: learnHandler,
  needsAuth: true,
};
