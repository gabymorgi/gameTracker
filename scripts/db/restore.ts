/* eslint-disable no-console */
import { askInfo, askQuestion, runCommand } from "../utils/console.ts";
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
  const filePath = askInfo(
    "Enter the file path to restore: ",
    async (input) => {
      try {
        await fs.promises.access(input, fs.constants.F_OK);
        return true;
      } catch (error) {
        console.error("File not found.");
        return false;
      }
    },
  );
  try {
    await runCommand(`psql "${process.env.DIRECT_URL}" -f "${filePath}"`);
  } catch (error) {
    console.error(error);
  }
}
