import { fileURLToPath } from "url";
import { readFile, writeFile } from "../../utils/file.js";
import { dirname, join } from "path";
import { fileNames } from "../../utils/const.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function parseKindleWords() {
  const input = await readFile<string>(fileNames.kindleImport);
  const freqData = await readFile<Record<string, number>>(
    join(__dirname, "..", "..", "..", "public", "words-frecuency.json"),
    true,
  );
  const items = input.toString().match(/(\d+\..*?)(?=(\r?\n){2,}\d+\.|$)/gs);

  const data = items?.map((item) => {
    const word = item.match(/\(([^)]+)\)/)?.[1];
    if (!word) {
      console.warn("No word found in:", item);
    }

    const phrases = item.split(/\r?\n/).slice(1); // Aquí dividimos por cualquier final de línea y ignoramos la primera
    if (phrases.length === 0) {
      console.warn("No phrases found in:", item);
    }
    const parsed = {
      word: word ?? "---",
      priority: 0,
      phrases: phrases
        .map((phrase) => {
          // Removemos números al principio si están presentes
          return {
            content: phrase.replace(/^\d+\)\s*/, ""),
          };
        })
        .filter((phrase) => {
          // Removemos frases vacías
          return phrase.content.length > 0;
        }),
    };

    if (!freqData[parsed.word]) {
      console.warn("No frequency data found for:", parsed.word);
    }

    parsed.priority = (freqData[parsed.word] || 0) + parsed.phrases.length - 1;

    return parsed;
  });

  await writeFile(fileNames.parsedImportWords, data);
}
