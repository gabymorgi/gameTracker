/* eslint-disable no-console */
import { getBatches } from "../../../utils/batch";
import { fileNames } from "../../../utils/const";
import { readFile, writeFile } from "../../../utils/file";
import { getTranslationRequest, Request } from "../../../utils/requests";

interface Phrase {
  id: string;
  content: string;
}

export async function generateTranslationsRequest() {
  console.log("processing translations");
  const data = await readFile<Phrase[]>(fileNames.translationIncomplete);
  const translationRequests: Request[] = [];
  for (const word of data) {
    translationRequests.push(getTranslationRequest(word.id, word.content));
  }

  const batches = getBatches(translationRequests, 1000);
  for (let i = 0; i < batches.length; i++) {
    await writeFile(`${fileNames.translationRequest}${i}.jsonl`, batches[i]);
  }
}
