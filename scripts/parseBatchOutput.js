/* eslint-disable no-console */
import { readFile, writeFile } from "./utils/fileUtils.js";

async function parseBatchDefinitionsOuput(inputFile, outputFile) {
  console.log("parsing batch definitions output");
  const data = await readFile(`${inputFile}.jsonl`);
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

  await writeFile(`${outputFile}.jsonl`, parsedData);
}

async function parseBatchPhrasesOuput(inputFile, outputFile) {
  console.log("parsing batch phrases output");
  const data = await readFile(`${inputFile}.jsonl`);
  const parsedData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].error) {
      console.error(
        `OPENAI error ${data[i].custom_id}: ${data[i].error.message}`,
      );
      continue;
    }
    try {
      const message = data[i].response.body.choices[0].message.content;
      const phrases = JSON.parse(message);
      for (let j = 0; j < phrases.sentences.length; j++) {
        parsedData.push({
          id: data[i].custom_id,
          phrase: phrases.sentences[j],
        });
      }
    } catch (error) {
      console.warn(`skipping ${data[i].custom_id}: ${error.message}`);
    }
  }

  await writeFile(`${outputFile}.jsonl`, parsedData);
}

async function parseBatchTranslationsOuput(inputFile, outputFile) {
  console.log("parsing batch translations output");
  const data = await readFile(`${inputFile}.jsonl`);
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

  await writeFile(`${outputFile}.jsonl`, parsedData);
}

async function parseBatchOutput() {
  const type = process.argv[2];
  let parseFunction;
  switch (type) {
    case "w":
      parseFunction = parseBatchDefinitionsOuput;
      break;
    case "p":
      parseFunction = parseBatchPhrasesOuput;
      break;
    case "t":
      parseFunction = parseBatchTranslationsOuput;
      break;
    default:
      console.log("Invalid type");
      return;
  }
  const limit = process.argv[3] ? Number(process.argv[3]) : 1;
  for (let i = 0; i < limit; i++) {
    await parseFunction(`batch_${type}_p${i}`, `parsed_${type}_batch_p${i}`);
  }
}

parseBatchOutput();
