/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { getBatchFiles, readFile } from "../../../utils/file.ts";
import { getBatches } from "../../../utils/batch.ts";
import { wait } from "../../../utils/promises.js";
import { fileNames } from "../../../utils/const.ts";

interface Word {
  id: number;
  pronunciation: string;
  definition: string;
}

export async function completeDefinitions() {
  let prisma;
  try {
    prisma = new PrismaClient();
    console.log("Uploading words!");
    const batchFiles = await getBatchFiles(fileNames.wordParsedBatch);
    for (const file of batchFiles) {
      console.log("Uploading file:", file);
      const data = await readFile<Word[]>(file);
      const batches = getBatches(data!, 25);
      let total = 0;
      for (const batch of batches) {
        const memoPromises = batch.map((word) =>
          prisma.word.update({
            where: {
              id: word.id,
            },
            data: {
              pronunciation: word.pronunciation,
              definition: word.definition,
            },
          }),
        );
        const memos = await prisma.$transaction(memoPromises);
        total += memos.length;
        console.log("Memos updated:", total);
        wait(500);
      }
    }
    console.log("All words uploaded!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
