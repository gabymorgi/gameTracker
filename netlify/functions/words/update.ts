import { Prisma } from "@prisma/client";
import { $SafeAny, CustomHandler } from "../../types";

const updateHandler: CustomHandler<"words/update"> = async (prisma, params) => {
  if (params.phrases) {
    const transactions: Prisma.PrismaPromise<$SafeAny>[] = [];
    if (params.phrases.create.length) {
      for (const phrase of params.phrases.create) {
        transactions.push(
          prisma.phrase.create({
            data: {
              content: phrase.content,
              translation: phrase.translation,
              wordId: params.id!,
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
        prisma.phrase.deleteMany({
          where: {
            id: {
              in: params.phrases.delete,
            },
          },
        }),
      );
    }
    await prisma.$transaction(transactions);
  }
  if (
    [
      "value",
      "definition",
      "pronunciation",
      "priority",
      "practiceWord",
      "practicePhrase",
      "practicePronunciation",
      "practiceListening",
      "practiceTranslation",
      "nextPractice",
    ].some((key) => params.hasOwnProperty(key))
  ) {
    return await prisma.word.update({
      where: {
        id: params.id,
      },
      data: {
        value: params.value,
        definition: params.definition,
        pronunciation: params.pronunciation,
        priority: params.priority,
        practiceWord: params.practiceWord,
        practicePhrase: params.practicePhrase,
        practicePronunciation: params.practicePronunciation,
        practiceListening: params.practiceListening,
        practiceTranslation: params.practiceTranslation,
        nextPractice: params.nextPractice,
      },
      include: {
        phrases: true,
      },
    });
  } else {
    return await prisma.word.findFirstOrThrow({
      where: {
        id: params.id,
      },
      include: {
        phrases: true,
      },
    });
  }
};

export default {
  path: "update",
  handler: updateHandler,
  needsAuth: true,
};
