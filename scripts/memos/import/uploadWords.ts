/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { readFile } from "../../utils/file.ts";
import { getBatches } from "../../utils/batch.ts";
import { wait } from "../../utils/promises.js";
import { fileNames } from "../../utils/const.ts";

interface Memo {
  word: string;
  priority: number;
  phrases: Array<{
    content: string;
  }>;
}

export default async function uploadWords() {
  const prisma = new PrismaClient();
  try {
    console.log("Uploading words!");
    const data = await readFile<Memo[]>(fileNames.parsedImportWords);
    const batches = getBatches(data, 25);
    let total = 0;
    for (const batch of batches) {
      const memoPromises = batch.map((memo) =>
        prisma.word.upsert({
          where: {
            value: memo.word,
          },
          create: {
            value: memo.word,
            priority: memo.priority + memo.phrases.length - 1,
            wordPhrases: {
              create: memo.phrases.map((phrase) => ({
                phrase: {
                  create: {
                    content: phrase.content,
                  },
                },
              })),
            },
          },
          update: {
            priority: {
              increment: memo.phrases.length,
            },
            practiceListening: {
              decrement: memo.phrases.length * 0.1,
            },
            practicePhrase: {
              decrement: memo.phrases.length * 0.1,
            },
            practicePronunciation: {
              decrement: memo.phrases.length * 0.1,
            },
            practiceTranslation: {
              decrement: memo.phrases.length * 0.1,
            },
            practiceWord: {
              decrement: memo.phrases.length * 0.1,
            },
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
      total += memos.length;
      console.log("Memos created:", total);
      await wait(500);
    }

    console.log("Normalizing practice values...");
    await prisma.word.updateMany({
      where: {
        practiceListening: {
          lte: 0,
        },
      },
      data: {
        practiceListening: 0,
      },
    });

    await prisma.word.updateMany({
      where: {
        practicePhrase: {
          lte: 0,
        },
      },
      data: {
        practicePhrase: 0,
      },
    });

    await prisma.word.updateMany({
      where: {
        practicePronunciation: {
          lte: 0,
        },
      },
      data: {
        practicePronunciation: 0,
      },
    });

    await prisma.word.updateMany({
      where: {
        practiceTranslation: {
          lte: 0,
        },
      },
      data: {
        practiceTranslation: 0,
      },
    });

    await prisma.word.updateMany({
      where: {
        practiceWord: {
          lte: 0,
        },
      },
      data: {
        practiceWord: 0,
      },
    });
    console.log("All words uploaded!");
  } catch (error) {
    console.error(error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
