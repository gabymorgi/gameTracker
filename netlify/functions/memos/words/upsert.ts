import { Prisma } from "@prisma/client";
import { CRUDArray, CustomHandler } from "../../../types";

interface UrlParams {
  id: string;
}

interface Params {
  id?: string;
  word: string;
  phrases: CRUDArray<{
    id: string;
    content: string;
    translation: string;
  }>;
  definition: string;
  pronunciation: string;
  priority: number;
  practiceWord: number;
  practicePhrase: number;
  practicePronunciation: number;
  practiceListening: number;
  practiceTranslation: number;
}

const updateHandler: CustomHandler = async (
  prisma,
  _: UrlParams,
  params: Params,
) => {
  let memo: any;
  if (params.id) {
    if (
      ["priority", "pronunciation", "definition"].some((key) =>
        params.hasOwnProperty(key),
      )
    ) {
      memo = await prisma.word.update({
        where: {
          id: params.id,
        },
        data: {
          priority: params.priority,
          pronunciation: params.pronunciation,
          definition: params.definition,
        },
      });
    }
  } else {
    memo = await prisma.word.create({
      data: {
        value: params.word,
        priority: params.priority,
        pronunciation: params.pronunciation,
        definition: params.definition,
        nextPractice: new Date(),
      },
    });
  }
  if (params.phrases) {
    const transactions: Prisma.PrismaPromise<any>[] = [];
    if (params.phrases.create.length) {
      for (const phrase of params.phrases.create) {
        transactions.push(
          prisma.phrase.create({
            data: {
              content: phrase.content,
              translation: phrase.translation,
              wordPhrases: {
                create: {
                  word: {
                    connect: {
                      id: memo.id,
                    },
                  },
                },
              },
            },
          }),
        );
      }
    }
    if (params.phrases.update.length) {
      for (const phrase of params.phrases.update) {
        transactions.push(
          prisma.phrase.update({
            where: {
              id: phrase.id,
            },
            data: {
              content: phrase.content,
              translation: phrase.translation,
            },
          }),
        );
      }
    }
    if (params.phrases.delete.length) {
      transactions.push(
        prisma.wordPhrase.deleteMany({
          where: {
            wordId: memo.id,
            phraseId: {
              in: params.phrases.delete,
            },
          },
        }),
      );
      transactions.push(
        prisma.phrase.deleteMany({
          where: {
            id: {
              in: params.phrases.delete,
            },
          },
        }),
      );
    }
    const phrases = await prisma.$transaction(transactions);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memo,
        phrases,
      }),
    };
  }
  return memo;
};

export default {
  path: "words/upsert",
  handler: updateHandler,
  needsAuth: true,
};
