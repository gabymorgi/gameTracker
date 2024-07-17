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
  const limit = process.argv[2] ? Number(process.argv[2]) : 1;
  for (let i = 0; i < limit; i++) {
    const data = await readFile(`parsed_p_batch_p${i}.jsonl`);
    const batches = getBatches(data, 25);
    let total = 0;
    for (const batch of batches) {
      const phrasesPromises = batch.map((word) =>
        prisma.phrase.create({
          data: {
            content: word.phrase,
            wordPhrases: {
              create: {
                word: {
                  connect: {
                    id: word.id,
                  },
                },
              },
            },
          },
        }),
      );
      const phrases = await prisma.$transaction(phrasesPromises);
      total += phrases.length;
      console.log("Phrases created:", total);
      wait(500);
    }
    console.log("All phrases created!");
  }
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
