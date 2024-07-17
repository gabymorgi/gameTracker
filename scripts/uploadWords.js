/* eslint-disable no-console */
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { readFile } from "./utils/fileUtils.js";
import { getBatches } from "./utils/batchUtils.js";
import { wait } from "./utils/promises.js";

config();

const prisma = new PrismaClient();

async function uploadWords() {
  console.log("Uploading words!");
  const data = await readFile("kindle-words.jsonl");
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
    total += memos.length;
    console.log("Memos created:", total);
    wait(500);
  }
  console.log("All words uploaded!");
}

async function main() {
  try {
    await uploadWords();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
