/* eslint-disable no-console */
import { getBatches } from "../../../utils/batch.ts";
import { fileNames } from "../../../utils/const.ts";
import { readFile, writeFile } from "../../../utils/file.ts";
import { getPhraseRequest, Request } from "../../../utils/requests.ts";

interface Phrase {
  id: string;
  value: string;
}

export default async function generatePhrasesRequest() {
  console.log("processing phrases");
  const data = await readFile<Phrase[]>(fileNames.wordIncomplete);
  const phraseRequests: Request[] = [];
  for (const word of data) {
    phraseRequests.push(getPhraseRequest(word));
  }

  const batches = getBatches(phraseRequests, 500);
  for (let i = 0; i < batches.length; i++) {
    await writeFile(`${fileNames.phraseRequest}${i}.jsonl`, batches[i]);
  }
}
