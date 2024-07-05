/* eslint-disable no-console */
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  readJsonLFile,
  writeJsonFile,
  writeJsonLFile,
} from "./utils/fileUtils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function parseBatchDefinitionsOuput(inputFile, outputFile) {
  console.log("parsing batch definitions output");
  const data = await readJsonLFile(join(__dirname, `files/${inputFile}.jsonl`));
  const parsedData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].error) {
      console.log(`skipping ${data[i].custom_id}: ${data[i].error.message}`);
      continue;
    }
    try {
      const message = data[i].response.body.choices[0].message.content;
      const definition = JSON.parse(message);
      parsedData.push({
        id: data[i].custom_id,
        pronunciation: definition.pronunciation,
        definition: definition.definitions.join("\n"),
      });
    } catch (error) {
      console.log(`skipping ${data[i].custom_id}: ${error.message}`);
    }
  }

  await writeJsonLFile(
    join(__dirname, `files/${outputFile}.jsonl`),
    parsedData,
  );
}

async function parseBatchPhrasesOuput(inputFile, outputFile) {
  console.log("parsing batch phrases output");
  const originalData = await readJsonLFile(
    join(__dirname, "files/words.jsonl"),
  );
  const originalDataMap = new Map();
  for (let i = 0; i < originalData.length; i++) {
    originalDataMap.set(
      originalData[i].id,
      originalData[i].wordPhrases.map((wordPhrase) => ({
        id: wordPhrase.phrase.id,
        content: wordPhrase.phrase.content,
      })),
    );
  }
  const data = await readJsonLFile(join(__dirname, `files/${inputFile}.jsonl`));
  let skipData = 0;
  const createData = [];
  const deleteData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].error) {
      console.log(`skipping ${data[i].custom_id}: ${data[i].error.message}`);
      continue;
    }
    try {
      const message = data[i].response.body.choices[0].message.content;
      const phrases = JSON.parse(message);
      const originalPhrases = originalDataMap.get(data[i].custom_id);
      for (let j = 0; j < phrases.generated.length; j++) {
        const index = originalPhrases.findIndex(
          (phrase) => phrase.content.trim() === phrases.generated[j],
        );
        if (index !== -1) {
          originalPhrases.splice(index, 1);
          skipData++;
        } else {
          createData.push({
            id: data[i].custom_id,
            phrase: phrases.generated[j],
          });
        }
      }
      deleteData.push(...originalPhrases.map((phrase) => phrase.id));
    } catch (error) {
      console.log(`skipping ${data[i].custom_id}: ${error.message}`);
    }
  }

  console.log("skipped", skipData);

  await writeJsonFile(join(__dirname, `files/${outputFile}.json`), {
    createData,
    deleteData,
  });
}

async function parseBatchTranslationsOuput(inputFile, outputFile) {
  console.log("parsing batch translations output");
  const data = await readJsonLFile(join(__dirname, `files/${inputFile}.jsonl`));
  const parsedData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].error) {
      console.log(`skipping ${data[i].custom_id}: ${data[i].error.message}`);
      continue;
    }
    try {
      const message = data[i].response.body.choices[0].message.content;
      parsedData.push({
        id: data[i].custom_id,
        translation: message,
      });
    } catch (error) {
      console.log(`skipping ${data[i].custom_id}: ${error.message}`);
    }
  }

  await writeJsonLFile(
    join(__dirname, `files/${outputFile}.jsonl`),
    parsedData,
  );
}

async function parseBatchOutput() {
  const limit = process.argv[2] ? Number(process.argv[2]) : 1;
  for (let i = 0; i < limit; i++) {
    await parseBatchDefinitionsOuput(
      `batch_definition_output_p${i}`,
      `parsed_definition_batch_p${i}`,
    );
    await parseBatchPhrasesOuput(
      `batch_phrase_output_p${i}`,
      `parsed_phrase_batch_p${i}`,
    );
    await parseBatchTranslationsOuput(
      `batch_tranlation_output_p${i}`,
      `parsed_tranlation_batch_p${i}`,
    );
  }
}

parseBatchOutput();
