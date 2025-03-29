/* eslint-disable no-console */
import { fileURLToPath } from "url";
import { fileExists, getPath, readFile, writeFile } from "../utils/file.ts";
import { dirname, join } from "path";
import { fileNames } from "../utils/const.ts";
import Papa from "papaparse";
import { Lemmatizer } from "../lemmatizer/index.ts";
import { wait } from "../utils/promises.ts";
import { getBatches } from "../utils/batch.ts";
import Prisma from "../utils/prisma.ts";
const __dirname = dirname(fileURLToPath(import.meta.url));

interface Memo {
  word: string;
  priority: number;
  phrases: Array<{
    content: string;
  }>;
}

async function parseCSVWords(
  freqData: Record<string, number>,
  Lemma: Lemmatizer,
): Promise<Memo[]> {
  const input = await readFile<string>(fileNames.csvImport);

  interface CSVWord {
    word: string;
    phrase: string;
  }
  return new Promise<Memo[]>((resolve, reject) => {
    Papa.parse<CSVWord>(input, {
      header: true,
      complete: async function (results) {
        try {
          const parsedWords: Record<string, string[]> = {};
          results.data.forEach((word) => {
            const lemmaWord = Lemma.lemmas(word.word.toLocaleLowerCase())[0];
            if (!parsedWords[lemmaWord]) {
              parsedWords[lemmaWord] = [word.phrase];
            } else {
              parsedWords[lemmaWord].push(word.phrase);
            }
          });

          const data: Memo[] = Object.entries(parsedWords).map(
            ([word, phrases]) => {
              if (!freqData[word]) {
                console.warn("No frequency data found for:", word);
              }

              const priority = (freqData[word] || 0) + phrases.length - 1;
              return {
                word,
                priority,
                phrases: phrases.map((phrase) => {
                  return {
                    content: phrase,
                  };
                }),
              };
            },
          );
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
    });
  });
}

async function parseKindleWords(
  freqData: Record<string, number>,
  Lemma: Lemmatizer,
): Promise<Memo[]> {
  const input = await readFile<string>(fileNames.kindleImport);
  // iterate over each line
  const lines = input.split("\n");
  const parsedWords: Memo[] = [];
  for (const line of lines) {
    const trimmedLine = line.trim();
    // if line is empty, skip it
    if (!trimmedLine) {
      continue;
    }
    // if starts with a number and a dot, its a new word
    if (/^\d+\./.test(trimmedLine)) {
      // example: 16. nabbed (nab)
      // get only whats between the parenthesis
      const word = trimmedLine.match(/\(([^)]+)\)/)?.[1];
      parsedWords.push({
        word: word ? Lemma.lemmas(word)[0] : "---",
        priority: freqData[word] || 0,
        phrases: [],
      });

      if (!freqData[word]) {
        console.warn("No frequency data found for:", word);
      }
    } else {
      // its a phrase
      // if starts with a number and a ")", remove the beginning and add it to the phrases
      parsedWords[parsedWords.length - 1].phrases.push({
        content: trimmedLine.replace(/^\d+\)\s*/, "").trim(),
      });
    }
  }

  return parsedWords;
}

interface Memo {
  word: string;
  priority: number;
  phrases: Array<{
    content: string;
  }>;
}

async function uploadWords() {
  const prisma = Prisma.getInstance();
  try {
    console.log("Uploading words!");
    const data = await readFile<Memo[]>(fileNames.parsedImportWords);
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
            priority: memo.priority + memo.phrases.length - 1,
            phrases: {
              create: memo.phrases.map((phrase) => ({
                content: phrase.content,
              })),
            },
          },
          update: {
            priority: {
              increment: memo.phrases.length,
            },
            practiceListening: {
              decrement: memo.phrases.length * 0.1,
            },
            practicePhrase: {
              decrement: memo.phrases.length * 0.1,
            },
            practicePronunciation: {
              decrement: memo.phrases.length * 0.1,
            },
            practiceTranslation: {
              decrement: memo.phrases.length * 0.1,
            },
            practiceWord: {
              decrement: memo.phrases.length * 0.1,
            },
            phrases: memo.phrases
              ? {
                  create: memo.phrases.map((phrase) => ({
                    content: phrase.content,
                  })),
                }
              : undefined,
          },
        }),
      );
      const memos = await prisma.$transaction(memoPromises);
      total += memos.length;
      console.log("Memos created:", total);
      await wait(500);
    }

    console.log("Normalizing practice values...");
    const normalizinPromises = [
      "practiceListening",
      "practicePhrase",
      "practicePronunciation",
      "practiceTranslation",
      "practiceWord",
    ].map((field) => {
      return prisma.word.updateMany({
        where: {
          [field]: {
            lte: 0,
          },
        },
        data: {
          [field]: 0,
        },
      });
    });

    await prisma.$transaction(normalizinPromises);
    console.log("All words uploaded!");
  } catch (error) {
    console.error(error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

export default async function importWords() {
  const freqData = await readFile<Record<string, number>>(
    join(__dirname, "..", "..", "public", "words-frecuency.json"),
    true,
  );
  const Lemma = new Lemmatizer();
  await Lemma.awaitUntilInitialized();
  const importedWords: Memo[] = [];
  if (fileExists(getPath(fileNames.csvImport))) {
    console.log("Parsing CSV import...");
    const data = await parseCSVWords(freqData, Lemma);
    importedWords.push(...data);
  }
  if (fileExists(getPath(fileNames.kindleImport))) {
    console.log("Parsing Kindle import...");
    const data = await parseKindleWords(freqData, Lemma);
    importedWords.push(...data);
  }

  await writeFile(fileNames.parsedImportWords, importedWords);

  await uploadWords();
}
