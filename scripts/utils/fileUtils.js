/* eslint-disable no-console */
import fs from "fs";
import readline from "readline";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getPath(fileName) {
  return join(__dirname, "..", "files", fileName);
}

async function readJsonLFile(inputPath) {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(inputPath),
      crlfDelay: Infinity,
    });

    const objects = [];

    for await (const line of rl) {
      try {
        const obj = JSON.parse(line);
        objects.push(obj);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }

    rl.close();

    return objects;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function writeJsonLFile(outputPath, objects) {
  await fs.promises.writeFile(
    outputPath,
    objects.map((item) => JSON.stringify(item)).join("\n"),
  );
}

async function readJsonFile(inputPath) {
  try {
    const data = await fs.promises.readFile(inputPath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function writeJsonFile(outputPath, objects) {
  await fs.promises.writeFile(outputPath, JSON.stringify(objects));
}

async function readTextFile(inputPath) {
  const data = await fs.promises.readFile(inputPath);
  return data.toString();
}

export async function readFile(fileName, isPath = false) {
  const type = fileName.split(".").pop();
  try {
    const path = isPath ? fileName : getPath(fileName);
    switch (type) {
      case "json":
        return readJsonFile(path);
      case "jsonl":
        return readJsonLFile(path);
      case "txt":
        return readTextFile(path);
      default:
        throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function writeFile(fileName, data, isPath = false) {
  const type = fileName.split(".").pop();
  try {
    const path = isPath ? fileName : getPath(fileName);
    switch (type) {
      case "json":
        writeJsonFile(path, data);
        break;
      case "jsonl":
        writeJsonLFile(path, data);
        break;
      default:
        throw new Error("Unsupported file type");
    }
    console.log("File has been saved to:", path);
  } catch (error) {
    console.error("Error:", error);
  }
}
