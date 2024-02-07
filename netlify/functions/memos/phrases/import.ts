import { CustomHandler } from "../../../types";

interface Phrase {
  id: string;
  words: {
    value: string;
    priority: string;
  }[];
  content: string;
  translation?: string;
}

const importHandler: CustomHandler = async (
  prisma,
  _,
  params: Array<Phrase>,
) => {
  const phrasePromises = params.map((phrase) =>
    prisma.phrase.create({
      data: {
        content: phrase.content,
        translation: phrase.translation,
      },
    }),
  );
  const phrases = await prisma.$transaction(phrasePromises);
  return phrases;
};

export default {
  path: "phrases/import",
  handler: importHandler,
  needsAuth: true,
};
