/* eslint-disable no-console */
import { askInfo, askQuestion, runCommandWithArgs } from "../utils/console.ts";
import fs from "fs";

export default async function dumpDatabase() {
  const input = await askQuestion(
    "This has not been tested. Are you sure you want to continue? (yes, no): ",
    ["yes", "no"],
  );
  if (input !== "yes") {
    console.log("Aborting...");
    return;
  }
  const filePath = await askInfo(
    "Enter the file path to restore: ",
    async (input) => {
      try {
        await fs.promises.access(input, fs.constants.F_OK);
        return true;
      } catch (error) {
        console.error("File not found:", error);
        return false;
      }
    },
  );

  const connectionUrl = process.env.DIRECT_URL;

  if (!connectionUrl) {
    console.error("DIRECT_URL is not defined.");
    return;
  }

  try {
    await runCommandWithArgs("psql", ["-d", connectionUrl, "-f", filePath]);
  } catch (error) {
    console.error(error);
  }
}
