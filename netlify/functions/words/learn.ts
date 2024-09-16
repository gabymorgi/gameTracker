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

  await prisma.phrase.deleteMany({
    where: {
      wordId: params.id,
    },
  });
  return word;
};

export default {
  path: "learn",
  handler: learnHandler,
  needsAuth: true,
};
