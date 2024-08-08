/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { readFile } from "../../../utils/file.ts";
import { getBatches } from "../../../utils/batch.ts";
import { wait } from "../../../utils/promises.js";
import { fileNames } from "../../../utils/const.ts";

interface Word {
  id: string;
  pronunciation: string;
  definition: string;
}

export default async function completeDefinitions() {
  const prisma = new PrismaClient();
  try {
    console.log("Uploading words!");
    const data = await readFile<Word[]>(fileNames.wordParsedBatch);
    const batches = getBatches(data!, 25);
    let total = 0;
    for (const batch of batches) {
      console.log(batch.map((word) => word.id));
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
    console.log("All words uploaded!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
