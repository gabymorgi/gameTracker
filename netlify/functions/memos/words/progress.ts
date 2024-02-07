import { CustomHandler } from "../../../types";
import { addDays } from "date-fns";

interface UrlParams {
  id: string;
}

interface Params {
  practiceWord?: number;
  practicePhrase?: number;
  practicePronunciation?: number;
  practiceListening?: number;
  practiceTranslation?: number;
  total: number;
}

const progressHandler: CustomHandler = async (
  prisma,
  urlParams: UrlParams,
  params: Params,
) => {
  const word = await prisma.word.update({
    where: { id: urlParams.id },
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
  path: "words/progress/:id",
  handler: progressHandler,
  needsAuth: true,
};
