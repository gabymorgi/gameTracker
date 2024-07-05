/* eslint-disable no-console */
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readJsonLFile, writeJsonLFile } from "./utils/fileUtils.js";
import {
  generateDefinitionRequest,
  generatePhraseRequest,
  generateTranslationRequest,
} from "./utils/requestUtils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getBatches(values, batch_size = 500) {
  const batches = [];
  for (let i = 0; i < values.length; i += batch_size) {
    batches.push(values.slice(i, i + batch_size));
  }
  return batches;
}

async function processDefinitions(data) {
  console.log("processing definitions");
  const definitionRequests = [];
  for (let i = 0; i < data.length; i++) {
    definitionRequests.push(
      generateDefinitionRequest(data[i].id, { word: data[i].value }),
    );
  }

  const batches = getBatches(definitionRequests, 500);
  for (let i = 0; i < batches.length; i++) {
    await writeJsonLFile(
      join(__dirname, `files/req_definition_p${i}.jsonl`),
      batches[i],
    );
  }
}

async function processPhrases(data) {
  console.log("processing phrases");
  const phraseRequests = [];
  for (let i = 0; i < data.length; i++) {
    phraseRequests.push(
      generatePhraseRequest(data[i].id, {
        word: data[i].value,
        examples: data[i].wordPhrases.map(
          (wordPhrase) => wordPhrase.phrase.content,
        ),
      }),
    );
  }

  const batches = getBatches(phraseRequests, 500);
  for (let i = 0; i < batches.length; i++) {
    await writeJsonLFile(
      join(__dirname, `files/req_phrase_p${i}.jsonl`),
      batches[i],
    );
  }
}

async function processTranslations(data) {
  console.log("processing translations");
  const translationRequests = [];
  for (let i = 0; i < data.length; i++) {
    translationRequests.push(
      generateTranslationRequest(data[i].id, data[i].content),
    );
  }

  const batches = getBatches(translationRequests, 1000);
  for (let i = 0; i < batches.length; i++) {
    await writeJsonLFile(
      join(__dirname, `files/req_translation_p${i}.jsonl`),
      batches[i],
    );
  }
}

async function processFile() {
  const words = await readJsonLFile(join(__dirname, "files/words.jsonl"));
  await processDefinitions(words);
  await processPhrases(words);
  const phrases = await readJsonLFile(join(__dirname, "files/tran.jsonl"));
  await processTranslations(phrases);
}

processFile();
