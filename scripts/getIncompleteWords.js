/* eslint-disable no-console */
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "./utils/fileUtils.js";

config();

const prisma = new PrismaClient();

async function getIncompleteWords() {
  console.log("Getting words!");
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

  await writeFile("incomplete-words.jsonl", memos);
}

async function main() {
  try {
    await getIncompleteWords();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
