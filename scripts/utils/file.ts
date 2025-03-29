/* eslint-disable no-console */
import fs from "fs";
import readline from "readline";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function fileExists(fileName: string) {
  try {
    await fs.promises.access(fileName, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function deleteFile(fileName: string) {
  try {
    await fs.promises.unlink(fileName);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export function getPath(fileName: string) {
  return join(__dirname, "..", "files", fileName);
}

export async function getBatchFiles(fileNameMatch: string): Promise<string[]> {
  try {
    const match = `${fileNameMatch}*`;
    const files = fs.readdirSync(join(__dirname, "..", "files"));
    const matchFiles = files.filter((file) => file.match(match));
    console.log(`Found ${matchFiles.length} files.`);
    return matchFiles;
  } catch (err) {
    console.error("Error reading files:", err);
    throw err;
  }
}

async function readJsonLFile<T>(inputPath: string): Promise<Array<T>> {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputPath),
    crlfDelay: Infinity,
  });

  const objects: Array<T> = [];

  for await (const line of rl) {
    if (!line) continue;
    try {
      const obj: T = JSON.parse(line);
      objects.push(obj);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  rl.close();

  return objects;
}

async function readJsonFile<T>(inputPath: string): Promise<T> {
  const data = await fs.promises.readFile(inputPath);
  return JSON.parse(data.toString());
}

async function readTextFile(inputPath: string): Promise<string> {
  const data = await fs.promises.readFile(inputPath);
  return data.toString();
}

export async function readFile<T>(
  fileName: string,
  isPath = false,
): Promise<T> {
  const type = fileName.split(".").pop();
  try {
    const path = isPath ? fileName : getPath(fileName);
    // check if the file exists
    await fs.promises.access(path, fs.constants.F_OK);
    switch (type) {
      case "json":
        return readJsonFile(path) as T;
      case "jsonl":
        return readJsonLFile(path) as T;
      case "txt":
      case "csv":
        return readTextFile(path) as T;
      default:
        throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function writeJsonLFile(outputPath: string, objects: Array<unknown>) {
  await fs.promises.writeFile(
    outputPath,
    objects.map((item) => JSON.stringify(item)).join("\n"),
  );
}

async function writeJsonFile(outputPath: string, objects: Array<unknown>) {
  await fs.promises.writeFile(outputPath, JSON.stringify(objects));
}

export async function writeFile(
  fileName: string,
  data: unknown,
  isPath = false,
) {
  const type = fileName.split(".").pop();
  try {
    const path = isPath ? fileName : getPath(fileName);
    // ensure the directory exists, create it if it doesn't
    await fs.promises.mkdir(dirname(path), { recursive: true });
    switch (type) {
      case "json":
        writeJsonFile(path, data as Array<unknown>);
        break;
      case "jsonl":
        writeJsonLFile(path, data as Array<unknown>);
        break;
      default:
        throw new Error("Unsupported file type");
    }
    console.log("File has been saved to:", path);
  } catch (error) {
    console.error("Error:", error);
  }
}
