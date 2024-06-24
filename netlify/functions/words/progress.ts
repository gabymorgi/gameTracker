import { CustomHandler } from "../../types";
import { addDays } from "date-fns";

interface Params {
  id: string;
  practiceWord?: number;
  practicePhrase?: number;
  practicePronunciation?: number;
  practiceListening?: number;
  practiceTranslation?: number;
  total: number;
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
      nextPractice: addDays(new Date(), Math.ceil(params.total)),
    },
  });
  return word;
};

export default {
  path: "progress",
  handler: progressHandler,
  needsAuth: true,
};
