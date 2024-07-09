import { CustomHandler } from "../../types";

interface Params {
  id: string;
  practiceWord?: number;
  practicePhrase?: number;
  practicePronunciation?: number;
  practiceListening?: number;
  practiceTranslation?: number;
  nextPractice?: Date;
}

const progressHandler: CustomHandler = async (prisma, params: Params) => {
  const word = await prisma.word.update({
    where: { id: params.id },
    data: {
      practiceListening: params.practiceListening,
      practicePhrase: params.practicePhrase,
      practicePronunciation: params.practicePronunciation,
      practiceTranslation: params.practiceTranslation,
      practiceWord: params.practiceWord,
      nextPractice: params.nextPractice,
    },
  });
  return word;
};

export default {
  path: "progress",
  handler: progressHandler,
  needsAuth: true,
};
