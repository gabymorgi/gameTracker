import { Prisma } from "@prisma/client";
import { $SafeAny, CustomHandler } from "../../types";

const updateHandler: CustomHandler<"words/upsert"> = async (prisma, params) => {
  let memo: $SafeAny;
  if (params.id) {
    if (
      ["word", "priority", "pronunciation", "definition"].some((key) =>
        params.hasOwnProperty(key),
      )
    ) {
      memo = await prisma.word.update({
        where: {
          id: params.id,
        },
        data: {
          value: params.value,
          priority: params.priority,
          pronunciation: params.pronunciation,
          definition: params.definition,
        },
      });
    }
  } else {
    memo = await prisma.word.create({
      data: {
        value: params.value,
        priority: params.priority,
        pronunciation: params.pronunciation,
        definition: params.definition,
        nextPractice: new Date(),
      },
    });
  }
  if (params.phrases) {
    const transactions: Prisma.PrismaPromise<$SafeAny>[] = [];
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
                      id: params.id || memo.id,
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
            wordId: params.id || memo.id,
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
      memo,
      phrases,
    };
  }
  return memo;
};

export default {
  path: "create",
  handler: updateHandler,
  needsAuth: true,
};
