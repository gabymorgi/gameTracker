/* eslint-disable no-console */
import { fileNames } from "../utils/const.ts";
import {
  deleteFile,
  fileExists,
  getBatchFiles,
  getPath,
  readFile,
  writeFile,
} from "../utils/file.ts";
import { wait } from "../utils/promises.ts";
import { config } from "dotenv";
import OpenAIClient from "../utils/openAI.ts";
import { askQuestion } from "../utils/console.ts";
import { PrismaClient, PrismaPromise } from "@prisma/client";
import { getBatches } from "../utils/batch.ts";
import Prisma from "../utils/prisma.ts";
import {
  getDefinitionRequest,
  getPhraseRequest,
  getTranslationRequest,
  Request,
} from "../utils/requests.ts";
import { FileObject } from "openai/resources/files";
import { Batch } from "openai/resources/batches";
config();

interface Checkpoint {
  id: string;
  stepNumber: number;
}

type ProcessType = "w" | "p" | "t";

interface Word {
  id: string;
  value: string;
  pronunciation: string;
  definition: string;
  phrase: string;
}

interface Phrase {
  id: string;
  content: string;
  translation: string;
}

async function getIncompleteWords() {
  const prisma = Prisma.getInstance();
  const memos = await prisma.word.findMany({
    where: {
      definition: {
        equals: null,
      },
    },
    select: {
      id: true,
      value: true,
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
  await writeFile(`w_${fileNames.incomplete}.jsonl`, memos);
  await writeFile(`p_${fileNames.incomplete}.jsonl`, memos);
}

async function getIncompletePhrases() {
  const prisma = Prisma.getInstance();
  const phrases = await prisma.phrase.findMany({
    where: {
      translation: null,
    },
    select: {
      id: true,
      content: true,
    },
  });

  await writeFile(`t_${fileNames.incomplete}.jsonl`, phrases);
}

type RequestItemCallback<T> = (item: T) => Request;

async function generateRequest<T>(
  type: ProcessType,
  requestItemCallback: RequestItemCallback<T>,
  batchSize = 500,
) {
  const data = await readFile<T[]>(`${type}_${fileNames.incomplete}.jsonl`);
  console.log("processing definitions");
  const definitionRequests: Request[] = [];
  for (const item of data) {
    definitionRequests.push(requestItemCallback(item));
  }

  const batches = getBatches(definitionRequests, batchSize);
  for (let i = 0; i < batches.length; i++) {
    await writeFile(`${type}_${fileNames.request}_${i}.jsonl`, batches[i]);
  }
}

async function sendRequest(type: ProcessType) {
  const batchFiles = await getBatchFiles(`${type}_${fileNames.request}`);
  const files: FileObject[] = [];
  const batches: Batch[] = [];
  for (let i = 0; i < batchFiles.length; i++) {
    console.log("parsing file:", getPath(batchFiles[i]));
    const file = await OpenAIClient.fileCreateBatch(getPath(batchFiles[i]));
    console.log("file uploaded:", file);
    await wait(500);
    const batch = await OpenAIClient.bactchCreate(file.id);
    console.log("batch created:", batch);

    files.push(file);
    batches.push(batch);
  }
  await writeFile(`${type}_${fileNames.pending}.json`, {
    files,
    batches,
  });
}

async function retrieveRequest(type: ProcessType) {
  const data = await readFile<{
    files: FileObject[];
    batches: Batch[];
  }>(`${type}_${fileNames.pending}.json`);
  for (let i = 0; i < data.batches.length; i++) {
    let retries = 0;
    let prevCompleted = 0;
    let batch = await OpenAIClient.batchRetrieve(data.batches[i].id);
    while (["validating", "in_progress", "finalizing"].includes(batch.status)) {
      if (prevCompleted === batch.request_counts.completed) {
        retries++;
      } else {
        retries = 0;
        prevCompleted = batch.request_counts.completed;
      }
      console.log(
        batch.status,
        batch.request_counts.completed,
        batch.request_counts.failed,
        batch.request_counts.total,
        "\n",
      );
      if (retries > 3) {
        console.log("aborting:", batch);
        const remainingData = {
          files: data.files.slice(i),
          batches: data.batches.slice(i),
        };
        await writeFile(`${fileNames.pending}.json`, remainingData);
        throw new Error("openai spend too long processing");
      }
      for (let j = 0; j < 30; j++) {
        await wait(10000);
        // print a ascii loading bar
        process.stdout.write(`\r[${"#".repeat(j).padEnd(30, " ")}]`);
      }
      batch = await OpenAIClient.batchRetrieve(batch.id);
    }
    if (batch.status !== "completed") {
      console.log("batch failed:", batch);
      return;
    }
    console.log("batch completed:", batch);
    await OpenAIClient.fileRetrieveContent(
      batch.output_file_id,
      getPath(`${type}_${fileNames.batch}_${i}.jsonl`),
    );
  }
}

interface ReqResponse {
  custom_id: number;
  response: {
    body: {
      choices: {
        message: {
          content: string;
        };
      }[];
    };
  };
  error?: {
    message: string;
  };
}

type OutputParserCallback<T> = (output: string) => T[];

function definitionParserCallback(output: string): Word[] {
  const definition = JSON.parse(output);
  return [
    {
      pronunciation: definition.pronunciation,
      definition: definition.definitions.join("\n"),
    } as Word,
  ];
}

function phraseParserCallback(output: string): Phrase[] {
  const phrases = JSON.parse(output);
  return phrases.sentences.map((phrase: string) => ({ phrase }));
}

function translationParserCallback(output: string): Phrase[] {
  return [
    {
      translation: output,
    } as Phrase,
  ];
}

async function parseBatch<T>(
  type: ProcessType,
  outputParserCallback: OutputParserCallback<T>,
) {
  const parsedData: T[] = [];
  const batchFiles = await getBatchFiles(`${type}_${fileNames.batch}`);
  for (const file of batchFiles) {
    console.log("parsing file:", file);
    const data = await readFile<ReqResponse[]>(file);
    for (const rawPhrase of data) {
      try {
        if (rawPhrase.error) {
          throw new Error(
            `OPENAI error ${rawPhrase.custom_id}: ${rawPhrase.error.message}`,
          );
        }
        const message = rawPhrase.response.body.choices[0].message.content;
        parsedData.push(
          ...outputParserCallback(message).map((item) => ({
            id: rawPhrase.custom_id,
            ...item,
          })),
        );
      } catch (error) {
        console.warn(`skipping ${rawPhrase.custom_id}: ${error.message}`);
      }
    }
  }
  await writeFile(`${type}_${fileNames.parsedBatch}.jsonl`, parsedData);
}

function definitionTransactionItem(prisma: PrismaClient, word: Word) {
  return prisma.word.update({
    where: {
      id: word.id,
    },
    data: {
      pronunciation: word.pronunciation,
      definition: word.definition,
    },
  });
}

function phraseTransactionItem(prisma: PrismaClient, word: Word) {
  return prisma.phrase.create({
    data: {
      content: word.phrase,
      wordId: word.id,
    },
  });
}

function translationTransactionItem(prisma: PrismaClient, phrase: Phrase) {
  return prisma.phrase.update({
    where: {
      id: phrase.id,
    },
    data: {
      translation: phrase.translation,
    },
  });
}

type TransactionItemCallback<T> = (
  prisma: PrismaClient,
  item: T,
) => PrismaPromise<unknown>;

async function completeDefinitions<T>(
  type: ProcessType,
  transactionItemCallback: TransactionItemCallback<T>,
) {
  const prisma = Prisma.getInstance();
  const data = await readFile<T[]>(`${type}_${fileNames.parsedBatch}.jsonl`);
  const batches = getBatches(data, 25);
  let total = 0;
  for (const batch of batches) {
    const transactionPromises = batch.map((item) =>
      transactionItemCallback(prisma, item),
    );
    const memos = await prisma.$transaction(transactionPromises);
    total += memos.length;

    console.log("Definitions updated:", total);
    await wait(500);
  }
}

const optionQuestion = "y: yes; s: skip; a: abort";
const options = ["y", "s", "a"];

const steps = [
  {
    description: "Words: Get incompletes",
    handler: getIncompleteWords,
  },
  {
    description: "Words: Generate requests",
    handler: () => generateRequest<Word>("w", getDefinitionRequest),
  },
  {
    description: "Words: Send request to OpenAI",
    handler: () => sendRequest("w"),
  },
  {
    description: "Phrases: Generate requests",
    handler: () => generateRequest<Word>("p", getPhraseRequest),
  },
  {
    description: "Phrases: Send request to OpenAI",
    handler: () => sendRequest("p"),
  },
  {
    description: "Words: Retrieve requests",
    handler: () => retrieveRequest("w"),
  },
  {
    description: "Phrases: Retrieve requests",
    handler: () => retrieveRequest("p"),
  },
  {
    description: "Words: Parse responses",
    handler: () => parseBatch<Word>("w", definitionParserCallback),
  },
  {
    description: "Words: Upload to db",
    handler: () => completeDefinitions("w", definitionTransactionItem),
  },
  {
    description: "Phrases: Parse responses",
    handler: () => parseBatch<Phrase>("p", phraseParserCallback),
  },
  {
    description: "Phrases: Upload to db",
    handler: () => completeDefinitions("p", phraseTransactionItem),
  },
  {
    description: "Translations: Get incompletes",
    handler: getIncompletePhrases,
  },
  {
    description: "Translations: Generate requests",
    handler: () => generateRequest<Phrase>("t", getTranslationRequest, 1000),
  },
  {
    description: "Translations: Send request to OpenAI",
    handler: () => sendRequest("t"),
  },
  {
    description: "Translations: Retrieve requests",
    handler: () => retrieveRequest("t"),
  },
  {
    description: "Translations: Parse responses",
    handler: () => parseBatch<Phrase>("t", translationParserCallback),
  },
  {
    description: "Translations: Upload to db",
    handler: () => completeDefinitions("t", translationTransactionItem),
  },
];

export default async function createFileBatch() {
  let i = 0;
  if (await fileExists(getPath("checkpoint.json"))) {
    const checkpoint = await readFile<Checkpoint>("checkpoint.json");
    console.log("checkpoint:", checkpoint);
    i = checkpoint.stepNumber;
  }
  for (; i < steps.length; i++) {
    const question = `${steps[i].description}\n${optionQuestion}`;
    const input = await askQuestion(question, options);
    if (input === "a") {
      break;
    }
    if (input === "s") {
      continue;
    }
    try {
      await steps[i].handler();
    } catch (error) {
      console.error("Error processing:", error);
      await writeFile(`checkpoint.json`, {
        step: i,
      });
      break;
    }
  }
  if (i === steps.length) {
    if (await fileExists(getPath("checkpoint.json"))) {
      deleteFile(getPath("checkpoint.json"));
    }
  } else {
    await writeFile(`checkpoint.json`, {
      stepNumber: i,
    });
  }
  Prisma.disconnect();
}
