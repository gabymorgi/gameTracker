import { CustomHandler } from "../../types";

const progressHandler: CustomHandler<"words/progress"> = async (
  prisma,
  params,
) => {
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
