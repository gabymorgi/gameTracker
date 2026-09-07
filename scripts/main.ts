/* eslint-disable no-console */
import "dotenv/config";
import { askQuestion } from "./utils/console.ts";
import { fileNames } from "./utils/const.ts";

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
        p: {
          description:
            "Probe prod data into seed snapshots (scripts/files/seed/)",
          handlerPath: "./db/probeSeed.ts",
        },
      },
    },
    book: {
      description: "create changelogs for books",
      handlerPath: "./books/createChangelogs.ts",
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
          description: `import from ${fileNames.csvImport} and ${fileNames.kindleImport} UTF-8`,
          handlerPath: "./memos/import.ts",
        },
        o: {
          description: "openai",
          handlerPath: "./memos/openai.ts",
        },
      },
    },
  },
};

function collectFlags(
  node: Menu,
  path: string[] = [],
  flags: Map<string, string> = new Map(),
): Map<string, string> {
  for (const [key, child] of Object.entries(node.children ?? {})) {
    const childPath = [...path, key];
    if (child.handlerPath) {
      flags.set(childPath.join("-"), child.handlerPath);
    }
    collectFlags(child, childPath, flags);
  }
  return flags;
}

async function runHandler(handlerPath: string) {
  console.log("------------\n\n");
  try {
    const action = await import(handlerPath);
    await action.default();
  } catch (error) {
    console.error("Error during dynamic import or action execution:", error);
  }
  console.log("\n\n------------");
}

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
    if (selectedItem) {
      if (selectedItem.handlerPath) {
        await runHandler(selectedItem.handlerPath);
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

const flags = collectFlags(menu);
const [arg] = process.argv.slice(2);

try {
  if (!arg || arg === "--menu") {
    await navigateMenu();
  } else if (arg.startsWith("--") && flags.has(arg.slice(2))) {
    await runHandler(flags.get(arg.slice(2))!);
  } else {
    console.error(
      `Unknown flag: ${arg}\nValid flags:\n${["--menu", ...[...flags.keys()].map((flag) => `--${flag}`)].join("\n")}`,
    );
    process.exit(1);
  }
} catch (error) {
  console.error("Error during navigation:", error);
}
