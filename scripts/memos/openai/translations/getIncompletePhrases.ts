/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { writeFile } from "../../../utils/file.ts";
import { fileNames } from "../../../utils/const.ts";

export default async function getIncompletePhrases() {
  const prisma = new PrismaClient();
  try {
    console.log("Getting phrases!");
    const phrases = await prisma.phrase.findMany({
      where: {
        translation: null,
      },
      select: {
        id: true,
        content: true,
      },
    });

    await writeFile(fileNames.translationIncomplete, phrases);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
