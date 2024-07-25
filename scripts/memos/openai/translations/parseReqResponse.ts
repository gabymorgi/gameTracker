/* eslint-disable no-console */
import { fileNames } from "../../../utils/const";
import { getBatchFiles, readFile, writeFile } from "../../../utils/file";

interface RawTranslation {
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

interface ParsedTranslation {
  id: number;
  translation: string;
}

export default async function parseBatchTranslationsOuput() {
  console.log("parsing batch translations output");
  const parsedData: ParsedTranslation[] = [];
  const batchFiles = await getBatchFiles(fileNames.phraseBatch);
  for (const file of batchFiles) {
    console.log("parsing file:", file);
    const data = await readFile<RawTranslation[]>(file);
    for (const rawPhrase of data) {
      if (rawPhrase.error) {
        throw new Error(
          `OPENAI error ${rawPhrase.custom_id}: ${rawPhrase.error.message}`,
        );
      }
      try {
        const message = rawPhrase.response.body.choices[0].message.content;
        parsedData.push({
          id: rawPhrase.custom_id,
          translation: message,
        });
      } catch (error) {
        console.log(`skipping ${rawPhrase.custom_id}: ${error.message}`);
      }
    }
  }

  await writeFile(fileNames.translationParsedBatch, parsedData);
}
