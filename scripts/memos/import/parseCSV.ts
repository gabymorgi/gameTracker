import { fileURLToPath } from "url";
import { readFile, writeFile } from "../../utils/file.js";
import { dirname, join } from "path";
import { fileNames } from "../../utils/const.js";
import Papa from "papaparse";
import { stem } from "porterstem";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function parseKindleWords() {
  const input = await readFile<string>(fileNames.csvImport);
  const freqData = await readFile<Record<string, number>>(
    join(__dirname, "..", "..", "..", "public", "words-frecuency.json"),
    true,
  );

  interface CSVWord {
    word: string;
    phrase: string;
  }
  Papa.parse<CSVWord>(input, {
    header: true,
    complete: async function (results) {
      const parsedWords: Record<string, string[]> = {};
      results.data.forEach((word) => {
        const stemmedWord = stem(word.word);
        if (!data[stemmedWord]) {
          data[stemmedWord] = [word.phrase];
        } else {
          data[stemmedWord].push(word.phrase);
        }
      });

      const data = Object.entries(parsedWords).map(([word, phrases]) => {
        if (!freqData[word]) {
          console.warn("No frequency data found for:", word);
        }

        const priority = (freqData[word] || 0) + phrases.length - 1;
        return {
          word,
          priority,
          phrases: phrases.map((phrase) => {
            return {
              content: phrase,
            };
          }),
        };
      });
      await writeFile(fileNames.parsedImportWords, data);
    },
  });
}
