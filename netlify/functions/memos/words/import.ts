import { CustomHandler } from "../../../types";

interface Memo {
  id?: string;
  word: string;
  phrases: {
    id?: string;
    content: string;
    translation: string;
  }[];
  definition: string;
  pronunciation: string;
  priority: string;
  practiceWord: string;
  practicePhrase: string;
  practicePronunciation: string;
  practiceListening: string;
  practiceTranslation: string;
}

const importHandler: CustomHandler = async (prisma, params: Array<Memo>) => {
  const memoPromises = params.map((memo: Memo) =>
    prisma.word.upsert({
      where: {
        value: memo.word,
      },
      create: {
        value: memo.word,
        priority: memo.priority ? Number(memo.priority) : undefined,
        wordPhrases: memo.phrases
          ? {
              create: memo.phrases.map((phrase) => ({
                phrase: {
                  create: {
                    content: phrase.content,
                    translation: phrase.translation,
                  },
                },
              })),
            }
          : undefined,
      },
      update: {
        priority: memo.phrases
          ? {
              increment: Number(memo.phrases.length) * 2,
            }
          : undefined,
        wordPhrases: memo.phrases
          ? {
              create: memo.phrases.map((phrase) => ({
                phrase: {
                  create: {
                    content: phrase.content,
                  },
                },
              })),
            }
          : undefined,
      },
    }),
  );
  const memos = await prisma.$transaction(memoPromises);
  return memos;
};

export default {
  path: "words/import",
  handler: importHandler,
  needsAuth: true,
};
