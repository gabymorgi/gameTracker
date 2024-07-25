/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { getBatchFiles, readFile } from "../../../utils/file.ts";
import { getBatches } from "../../../utils/batch.ts";
import { wait } from "../../../utils/promises.ts";
import { fileNames } from "../../../utils/const.ts";

interface Phrase {
  id: string;
  phrase: string;
}

export default async function createPhrases() {
  const prisma = new PrismaClient();
  try {
    console.log("Uploading words!");
    const batchFiles = await getBatchFiles(fileNames.phraseParsedBatch);
    for (const file of batchFiles) {
      console.log("Uploading file:", file);
      const data = await readFile<Phrase[]>(file);
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
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
