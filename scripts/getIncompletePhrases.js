/* eslint-disable no-console */
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "./utils/fileUtils.js";

config();

const prisma = new PrismaClient();

async function getIncompleteWords() {
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

  await writeFile("incomplete-phrases.jsonl", phrases);
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
