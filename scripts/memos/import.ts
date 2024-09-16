/* eslint-disable no-console */
import { fileURLToPath } from "url";
import { fileExists, getPath, readFile, writeFile } from "../utils/file.ts";
import { dirname, join } from "path";
import { fileNames } from "../utils/const.ts";
import Papa from "papaparse";
import { Lemmatizer } from "../lemmatizer/index.ts";
import { wait } from "../utils/promises.ts";
import { PrismaClient } from "@prisma/client";
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
  const items = input.match(/(\d+\..*?)(?=(\r?\n){2,}\d+\.|$)/gs);

  const data: Memo[] = items?.map((item) => {
    const word = item.match(/\(([^)]+)\)/)?.[1];
    if (!word) {
      console.warn("No word found in:", item);
    }

    const phrases = item.split(/\r?\n/).slice(1); // Aquí dividimos por cualquier final de línea y ignoramos la primera
    if (phrases.length === 0) {
      console.warn("No phrases found in:", item);
    }
    const parsed = {
      word: word ? Lemma.lemmas(word)[0] : "---",
      priority: 0,
      phrases: phrases
        .map((phrase) => {
          // Removemos números al principio si están presentes
          return {
            content: phrase.replace(/^\d+\)\s*/, "").trim(),
          };
        })
        .filter((phrase) => {
          // Removemos frases vacías
          return phrase.content.length > 0;
        }),
    };

    if (!freqData[parsed.word]) {
      console.warn("No frequency data found for:", parsed.word);
    }

    parsed.priority = freqData[parsed.word] || 0;

    return parsed;
  });

  return data;
}

async function filterRepeatedPhrases(params: Memo[]) {
  const prisma = Prisma.getInstance();
  const wordBatches = getBatches(params, 25);
  const filteredWords: Memo[] = [];
  let filteredPhrase = 0;
  let i = 1;
  for (const batch of wordBatches) {
    console.log(`Filtering ${i++}/${wordBatches.length}...`);
    const words = await prisma.word.findMany({
      where: {
        value: {
          in: batch.map((memo) => memo.word),
        },
      },
      select: {
        id: true,
        value: true,
        phrases: {
          select: {
            content: true,
          },
        },
      },
    });

    interface Word {
      id: number;
      value: string;
      phrases: Array<{
        content: string;
      }>;
    }

    const wordMap: Record<string, Word> = words.reduce((acc, word) => {
      acc[word.value] = word;
      return acc;
    }, {});

    const filteredBatch = batch.map((memo) => {
      const word = wordMap[memo.word];
      if (!word) {
        return memo;
      }

      const existingPhrases = word.phrases.map((phrase) =>
        phrase.content.trim(),
      );
      const newPhrases = memo.phrases.filter(
        (phrase) =>
          !existingPhrases.some((existingP) =>
            existingP.includes(phrase.content),
          ),
      );
      filteredPhrase += memo.phrases.length - newPhrases.length;
      return {
        ...memo,
        phrases: newPhrases,
      };
    });
    filteredWords.push(
      ...filteredBatch.filter((memo) => memo.phrases.length > 0),
    );
  }

  console.log("Filtered words:", params.length - filteredWords.length);
  console.log("Filtered phrases:", filteredPhrase);

  return filteredWords;
}

interface Memo {
  word: string;
  priority: number;
  phrases: Array<{
    content: string;
  }>;
}

async function uploadWords() {
  const prisma = new PrismaClient();
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
    const filteredData = await filterRepeatedPhrases(data);
    importedWords.push(...filteredData);
  }

  await writeFile(fileNames.parsedImportWords, importedWords);

  await uploadWords();
}
