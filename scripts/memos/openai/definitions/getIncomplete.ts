/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { writeFile } from "../../../utils/file.ts";
import { fileNames } from "../../../utils/const.ts";

export default async function getIncompleteWords() {
  console.log("Getting words!");
  const prisma = new PrismaClient();
  try {
    const memos = await prisma.word.findMany({
      where: {
        definition: {
          equals: null,
        },
      },
      select: {
        id: true,
        value: true,
        wordPhrases: {
          where: {
            phrase: {
              translation: {
                equals: null,
              },
            },
          },
          select: {
            phrase: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          priority: "desc",
        },
        {
          nextPractice: "asc",
        },
        {
          id: "asc",
        },
      ],
    });
    await writeFile(fileNames.wordIncomplete, memos);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
