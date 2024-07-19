/* eslint-disable no-console */
import { fileNames } from "../../../utils/const.ts";
import { getBatchFiles, readFile, writeFile } from "../../../utils/file.ts";

interface RawWord {
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

interface ParsedWord {
  id: number;
  pronunciation: string;
  definition: string;
}

export async function parseBatchDefinitionsOuput() {
  console.log("parsing batch definitions output");
  const batchFiles = await getBatchFiles(fileNames.wordBatch);
  const parsedData: ParsedWord[] = [];
  for (let i = 0; i < batchFiles.length; i++) {
    console.log("parsing file:", batchFiles[i]);
    const data = await readFile<RawWord[]>(batchFiles[i]);
    for (const rawWord of data) {
      try {
        if (rawWord.error) {
          throw new Error(
            `OPENAI error ${rawWord.custom_id}: ${rawWord.error.message}`,
          );
        }
        const message = rawWord.response.body.choices[0].message.content;
        const definition = JSON.parse(message);
        parsedData.push({
          id: rawWord.custom_id,
          pronunciation: definition.pronunciation,
          definition: definition.definitions.join("\n"),
        });
      } catch (error) {
        console.log(`skipping ${rawWord.custom_id}: ${error.message}`);
      }
    }
  }
  await writeFile(fileNames.wordParsedBatch, parsedData);
}
