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

export async function uploadWords() {
  let prisma;
  try {
    prisma = new PrismaClient();
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
            priority: memo.priority ? Number(memo.priority) : undefined,
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
          update: {
            priority: memo.phrases
              ? {
                  increment: Number(memo.phrases.length),
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
      total += memos.length;
      console.log("Memos created:", total);
      wait(500);
    }
    console.log("All words uploaded!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
