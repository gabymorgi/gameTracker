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

async function processDefinitions(data) {
  console.log("processing definitions");
  const definitionRequests = [];
  for (let i = 0; i < data.length; i++) {
    definitionRequests.push(
      generateDefinitionRequest(data[i].id, { word: data[i].value }),
    );
  }
  await writeJsonLFile(
    join(__dirname, "files/req_definition.jsonl"),
    definitionRequests,
  );
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
  await writeJsonLFile(
    join(__dirname, "files/req_phrase.jsonl"),
    phraseRequests,
  );
}

async function processTranslations(data) {
  console.log("processing translations");
  const translationRequests = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].wordPhrases.length; j++) {
      translationRequests.push(
        generateTranslationRequest(
          data[i].wordPhrases[j].phrase.id,
          data[i].wordPhrases[j].phrase.content,
        ),
      );
    }
  }
  await writeJsonLFile(
    join(__dirname, "files/req_translation.jsonl"),
    translationRequests,
  );
}

async function processFile() {
  if (process.argv[2] === "words") {
    const data = await readJsonLFile(join(__dirname, "files/words.jsonl"));
    await processDefinitions(data);
    await processPhrases(data);
  } else if (process.argv[2] === "tran") {
    const data = await readJsonLFile(join(__dirname, "files/tran.jsonl"));
    await processTranslations(data);
  } else {
    console.log("invalid argument", process.argv[2]);
  }
}

processFile();
