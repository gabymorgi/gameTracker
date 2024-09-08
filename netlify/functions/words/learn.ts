import { CustomHandler } from "../../types";

const learnHandler: CustomHandler<"words/learn"> = async (prisma, params) => {
  const word = await prisma.word.update({
    where: { id: params.id },
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
          wordId: params.id,
        },
      },
    },
    select: {
      id: true,
    },
  });
  const wordPhrases = await prisma.wordPhrase.deleteMany({
    where: {
      wordId: params.id,
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
  path: "learn",
  handler: learnHandler,
  needsAuth: true,
};
