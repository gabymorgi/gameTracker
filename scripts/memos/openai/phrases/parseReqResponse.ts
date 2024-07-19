/* eslint-disable no-console */
import { fileNames } from "../../../utils/const";
import { getBatchFiles, readFile, writeFile } from "../../../utils/file";

interface RawPhrase {
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

interface ParsedPhrase {
  id: number;
  phrase: string;
}

export async function parseBatchPhrasesOuput() {
  console.log("parsing batch phrases output");
  const parsedData: ParsedPhrase[] = [];
  const batchFiles = await getBatchFiles(fileNames.phraseBatch);
  for (const file of batchFiles) {
    console.log("parsing file:", file);
    const data = await readFile<RawPhrase[]>(file);
    for (const rawPhrase of data) {
      try {
        if (rawPhrase.error) {
          throw new Error(
            `OPENAI error ${rawPhrase.custom_id}: ${rawPhrase.error.message}`,
          );
        }
        const message = rawPhrase.response.body.choices[0].message.content;
        const phrases = JSON.parse(message);
        for (let j = 0; j < phrases.sentences.length; j++) {
          parsedData.push({
            id: rawPhrase.custom_id,
            phrase: phrases.sentences[j],
          });
        }
      } catch (error) {
        console.warn(`skipping ${rawPhrase.custom_id}: ${error.message}`);
      }
    }
  }
  await writeFile(fileNames.phraseParsedBatch, parsedData);
}
