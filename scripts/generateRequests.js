/* eslint-disable no-console */
import { readFile, writeFile } from "./utils/fileUtils.js";
import {
  generateDefinitionRequest,
  generatePhraseRequest,
  generateTranslationRequest,
} from "./utils/requestUtils.js";

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
    await writeFile(`req_w_p${i}.jsonl`, batches[i]);
  }
}

async function processPhrases(data) {
  console.log("processing phrases");
  const phraseRequests = [];
  for (let i = 0; i < data.length; i++) {
    phraseRequests.push(generatePhraseRequest(data[i].id, data[i].value));
  }

  const batches = getBatches(phraseRequests, 500);
  for (let i = 0; i < batches.length; i++) {
    await writeFile(`req_p_p${i}.jsonl`, batches[i]);
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
    await writeFile(`req_t_p${i}.jsonl`, batches[i]);
  }
}

async function processFile() {
  const type = process.argv[2];
  switch (type) {
    case "w":
      {
        const words = await readFile("incomplete-words.jsonl");
        await processDefinitions(words);
      }
      break;
    case "p":
      {
        const words = await readFile("incomplete-words.jsonl");
        await processPhrases(words);
      }
      break;
    case "t":
      {
        const phrases = await readFile("incomplete-phrases.jsonl");
        await processTranslations(phrases);
      }
      break;
    default:
      console.log("invalid type, should be w, p or t but got", type);
  }
}

processFile();
