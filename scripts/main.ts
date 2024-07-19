/* eslint-disable no-console */
import { config } from "dotenv";
import { askQuestion } from "./utils/console.ts";
import { parseKindleWords } from "./memos/import/parseKindle.ts";
import { uploadWords } from "./memos/import/uploadWords.ts";
import { importSteamGames } from "./games/importSteamGames.ts";
import { uploadGames } from "./games/uploadGames.ts";
import { getIncompleteWords } from "./memos/openai/definitions/getIncomplete.ts";
import { generateDefinitionRequest } from "./memos/openai/definitions/generateRequest.ts";
import { parseBatchDefinitionsOuput } from "./memos/openai/definitions/parseReqResponse.ts";
import { completeDefinitions } from "./memos/openai/definitions/complete.ts";
import { createPhrases } from "./memos/openai/phrases/completePhrases.ts";
import { generatePhrasesRequest } from "./memos/openai/phrases/generateRequest.ts";
import { parseBatchPhrasesOuput } from "./memos/openai/phrases/parseReqResponse.ts";
import { completePhrases } from "./memos/openai/translations/completeTranslations.ts";
import { generateTranslationsRequest } from "./memos/openai/translations/generateRequest.ts";
import { getIncompletePhrases } from "./memos/openai/translations/getIncompletePhrases.ts";
import { parseBatchTranslationsOuput } from "./memos/openai/translations/parseReqResponse.ts";
config();

interface Menu {
  description: string;
  question?: string;
  action?: () => Promise<void>;
  children?: Record<string, Menu>;
}

const menu: Menu = {
  description: "Main menu",
  question: "Select a topic:",
  children: {
    db: {
      description: "Database operations",
      question: "Select operation:",
      children: {
        b: {
          description: "Make a backup of the database",
          action: async () => console.log("db backup"),
        },
        r: {
          description:
            "Restore the database from a backup (ALL DATA WILL BE LOST)",
          action: async () => console.log("db restore"),
        },
      },
    },
    game: {
      description: "Import games from steam",
      question: "Select operation:",
      children: {
        i: {
          description: "Import from steam",
          action: importSteamGames,
        },
        u: {
          description: "Upload to db",
          action: uploadGames,
        },
      },
    },
    memo: {
      description: "Import memos from kindle/csv, OpenAI stuff, etc",
      question: "Select flow:",
      children: {
        i: {
          description: "import from kindle-words.txt",
          question: "Select operation:",
          children: {
            k: {
              description: "parse data from kindle",
              action: parseKindleWords,
            },
            u: {
              description: "upload parsed data to db",
              action: uploadWords,
            },
          },
        },
        o: {
          description: "openai",
          question: "Select data type:",
          children: {
            w: {
              description: "word definitions",
              question: "Select operation:",
              children: {
                i: {
                  description: "Get incompletes",
                  action: getIncompleteWords,
                },
                g: {
                  description: "Generate requests",
                  action: generateDefinitionRequest,
                },
                p: {
                  description: "Parse responses",
                  action: parseBatchDefinitionsOuput,
                },
                u: {
                  description: "Upload to db",
                  action: completeDefinitions,
                },
              },
            },
            p: {
              description: "phrases",
              question: "Select operation:",
              children: {
                g: {
                  description: "Generate requests",
                  action: generatePhrasesRequest,
                },
                p: {
                  description: "Parse responses",
                  action: parseBatchPhrasesOuput,
                },
                u: {
                  description: "Upload to db",
                  action: createPhrases,
                },
              },
            },
            t: {
              description: "translation",
              question: "Select operation:",
              children: {
                i: {
                  description: "Get incompletes",
                  action: getIncompletePhrases,
                },
                g: {
                  description: "Generate requests",
                  action: generateTranslationsRequest,
                },
                p: {
                  description: "Parse responses",
                  action: parseBatchTranslationsOuput,
                },
                u: {
                  description: "Upload to db",
                  action: completePhrases,
                },
              },
            },
          },
        },
      },
    },
  },
};

async function navigateMenu(path: string[] = []) {
  const actMenu = path.reduce((acc, curr) => acc.children![curr], menu);
  const options = Object.keys(actMenu.children!);
  let question = `${actMenu.question}\n${options
    .map((option) => `${option}: ${actMenu.children![option].description}`)
    .join("\n")}`;
  if (path.length > 0) {
    options.push("back");
    question += "\nback: Go back";
  }
  options.push("exit");
  question += "\nexit: Exit the program";
  const input = await askQuestion(question, options);

  if (input === "exit") {
    console.log("Bye...");
    return;
  } else if (input === "back") {
    if (path.length === 0) {
      return;
    }
    path.pop();
    return navigateMenu(path);
  } else {
    const selectedItem = actMenu.children![input];
    console.log({ input, selectedItem });
    if (selectedItem) {
      if (selectedItem.action) {
        console.log("------------\n\n");
        await selectedItem.action();
        console.log("\n\n------------");
      }
      if (selectedItem.children) {
        path.push(input);
        return navigateMenu(path);
      } else {
        return navigateMenu(path);
      }
    }
  }
}

navigateMenu();
