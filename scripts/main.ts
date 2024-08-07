/* eslint-disable no-console */
import { config } from "dotenv";
import { askQuestion } from "./utils/console.ts";
config();

interface Menu {
  description: string;
  question?: string;
  handlerPath?: string;
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
          handlerPath: "./db/backup.ts",
        },
        r: {
          description:
            "Restore the database from a backup (ALL DATA WILL BE LOST)",
          handlerPath: "./db/restore.ts",
        },
      },
    },
    game: {
      description: "Import games from steam",
      question: "Select operation:",
      children: {
        i: {
          description: "Import from steam",
          handlerPath: "./games/importSteamGames.ts",
        },
        u: {
          description: "Upload to db",
          handlerPath: "./games/uploadGames.ts",
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
              handlerPath: "./memos/import/parseKindle.ts",
            },
            u: {
              description: "upload parsed data to db",
              handlerPath: "./memos/import/uploadWords.ts",
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
                  handlerPath: "./memos/openai/definitions/getIncomplete.ts",
                },
                g: {
                  description: "Generate requests",
                  handlerPath: "./memos/openai/definitions/generateRequest.ts",
                },
                p: {
                  description: "Parse responses",
                  handlerPath: "./memos/openai/definitions/parseReqResponse.ts",
                },
                u: {
                  description: "Upload to db",
                  handlerPath: "./memos/openai/definitions/complete.ts",
                },
              },
            },
            p: {
              description: "phrases",
              question: "Select operation:",
              children: {
                g: {
                  description: "Generate requests",
                  handlerPath: "./memos/openai/phrases/generateRequest.ts",
                },
                p: {
                  description: "Parse responses",
                  handlerPath: "./memos/openai/phrases/parseReqResponse.ts",
                },
                u: {
                  description: "Upload to db",
                  handlerPath: "./memos/openai/phrases/completePhrases.ts",
                },
              },
            },
            t: {
              description: "translation",
              question: "Select operation:",
              children: {
                i: {
                  description: "Get incompletes",
                  handlerPath:
                    "./memos/openai/translations/getIncompletePhrases.ts",
                },
                g: {
                  description: "Generate requests",
                  handlerPath: "./memos/openai/translations/generateRequest.ts",
                },
                p: {
                  description: "Parse responses",
                  handlerPath:
                    "./memos/openai/translations/parseReqResponse.ts",
                },
                u: {
                  description: "Upload to db",
                  handlerPath:
                    "./memos/openai/translations/completeTranslations.ts",
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
      if (selectedItem.handlerPath) {
        console.log("------------\n\n");
        try {
          const action = await import(selectedItem.handlerPath);
          await action.default();
        } catch (error) {
          console.error(
            "Error during dynamic import or action execution:",
            error,
          );
        }
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

try {
  navigateMenu();
} catch (error) {
  console.error("Error during navigation:", error);
}
