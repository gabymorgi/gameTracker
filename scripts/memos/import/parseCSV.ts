import { fileURLToPath } from "url";
import { readFile, writeFile } from "../../utils/file.ts";
import { dirname, join } from "path";
import { fileNames } from "../../utils/const.ts";
import Papa from "papaparse";
import { Lemmatizer } from "../../lemmatizer/index.ts";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function parseKindleWords() {
  const input = await readFile<string>(fileNames.csvImport);
  const freqData = await readFile<Record<string, number>>(
    join(__dirname, "..", "..", "..", "public", "words-frecuency.json"),
    true,
  );
  const Lemma = new Lemmatizer();
  await Lemma.awaitUntilInitialized();

  interface CSVWord {
    word: string;
    phrase: string;
  }
  Papa.parse<CSVWord>(input, {
    header: true,
    complete: async function (results) {
      const parsedWords: Record<string, string[]> = {};
      results.data.forEach((word) => {
        const lemmaWord = Lemma.lemmas(word.word.toLocaleLowerCase())[0];
        if (!parsedWords[lemmaWord]) {
          parsedWords[lemmaWord] = [word.phrase];
        } else {
          parsedWords[lemmaWord].push(word.phrase);
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
