/* eslint-disable no-console */
import { fileNames } from "../../utils/const.ts";
import { getBatchFiles, getPath, readFile } from "../../utils/file.ts";
import { wait } from "../../utils/promises.ts";
import { config } from "dotenv";
import OpenAIClient from "../../utils/openAI.ts";
import parseBatchDefinitionsOuput from "./definitions/parseReqResponse.ts";
import completeDefinitions from "./definitions/complete.ts";
import getIncompleteWords from "./definitions/getIncomplete.ts";
import generateDefinitionRequest from "./definitions/generateRequest.ts";
import { askQuestion } from "../../utils/console.ts";
import { PrismaClient } from "@prisma/client";
import { getBatches } from "../../utils/batch.ts";
config();

interface Word {
  id: string;
  pronunciation: string;
  definition: string;
}

async function completeDefinitions(prisma: PrismaClient) {
  console.log("Uploading words!");
  const data = await readFile<Word[]>(fileNames.wordParsedBatch);
  const batches = getBatches(data, 25);
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
    await wait(500);
  }
  console.log("All words uploaded!");
}

const optionQuestion = "y: yes; s: skip; a: abort";
const options = ["y", "s", "a"];

const steps = [
  {
    description: "Words: Get incompletes",
    handlerPath: getIncompleteWords,
  },
  {
    description: "Words: Generate requests",
    handlerPath: generateDefinitionRequest,
  },
  {
    description: "Words: Send request to OpenAI",
    handlerPath: generateDefinitionRequest,
  },
  {
    description: "Words: Parse responses",
    handlerPath: "./memos/openai/definitions/parseReqResponse.ts",
  },
  {
    description: "Words: Upload to db",
    handlerPath: completeDefinitions,
  },
];

export default async function createFileBatch() {
  for (let i = 0; i < steps.length; i++) {
    const question = `${steps[i].description}\n${optionQuestion}`;
    const input = await askQuestion(question, options);
    if (input === "a") {
      return;
    }
    if (input === "s") {
      continue;
    }
    await steps[i].handler();
  }
  console.log("parsing batch definitions output");
  // const batchFiles = await getBatchFiles(fileNames.wordRequest);
  // for (let i = 0; i < batchFiles.length; i++) {
  //   console.log("parsing file:", getPath(batchFiles[i]));
  //   const file = await OpenAIClient.fileCreateBatch(getPath(batchFiles[i]));
  //   console.log("file created:", file);
  //   await wait(1000);
  // }
  // const batch = await OpenAIClient.bactchCreate(
  //   "file-49puyPbtAlzkvRrkGessk4O1",
  // );
  // const batch = await OpenAIClient.batchRetrieve(
  //   "batch_oIpLMhX6hNd5423rt1XHgTsu",
  // );
  // await OpenAIClient.fileRetrieveContent(
  //   "file-ghMRgY4TmO0AwgmmlKmK9Bw8",
  //   getPath(fileNames.wordBatch),
  // );

  // parseBatchDefinitionsOuput();
  // completeDefinitions();
  for (const file of files) {
    OpenAIClient.fileDelete(file.id);
  }
  // console.log("batch created:", batch);
}

createFileBatch();
