/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { getBatchFiles, readFile } from "../../../utils/file.ts";
import { getBatches } from "../../../utils/batch.ts";
import { wait } from "../../../utils/promises.ts";
import { fileNames } from "../../../utils/const.ts";

interface Phrase {
  id: string;
  translation: string;
}

export async function completePhrases() {
  let prisma;
  try {
    prisma = new PrismaClient();
    console.log("Uploading words!");
    const batchFiles = await getBatchFiles(fileNames.translationParsedBatch);
    for (const file of batchFiles) {
      console.log("Uploading file:", file);
      const data = await readFile<Phrase[]>(file);
      const batches = getBatches(data, 25);
      let total = 0;
      for (const batch of batches) {
        const memoPromises = batch.map((phrase) =>
          prisma.phrase.update({
            where: {
              id: phrase.id,
            },
            data: {
              translation: phrase.translation,
            },
          }),
        );
        const memos = await prisma.$transaction(memoPromises);
        total += memos.length;
        console.log("Phrase translated:", total);
        wait(500);
      }
      console.log("All phrases translated!");
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
