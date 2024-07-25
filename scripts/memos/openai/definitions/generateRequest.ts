/* eslint-disable no-console */
import { getBatches } from "../../../utils/batch.ts";
import { fileNames } from "../../../utils/const.ts";
import { readFile, writeFile } from "../../../utils/file.ts";
import { getDefinitionRequest, Request } from "../../../utils/requests.ts";

interface Word {
  id: string;
  value: string;
}

export default async function generateDefinitionRequest() {
  const data = await readFile<Word[]>(fileNames.wordIncomplete);
  console.log("processing definitions");
  const definitionRequests: Request[] = [];
  for (const word of data) {
    definitionRequests.push(getDefinitionRequest(word.id, word.value));
  }

  const batches = getBatches(definitionRequests, 500);
  for (let i = 0; i < batches.length; i++) {
    await writeFile(`${fileNames.wordRequest}${i}.jsonl`, batches[i]);
  }
}
