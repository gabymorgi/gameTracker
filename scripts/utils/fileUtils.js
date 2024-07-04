import fs from "fs";
import readline from "readline";

export async function readJsonLFile(inputPath) {
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

export async function writeJsonLFile(outputPath, objects) {
  try {
    await fs.promises.writeFile(
      outputPath,
      objects.map((item) => JSON.stringify(item)).join("\n"),
    );
    console.log("File has been saved to:", outputPath);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function writeJsonFile(outputPath, objects) {
  try {
    await fs.promises.writeFile(outputPath, JSON.stringify(objects));
    console.log("File has been saved to:", outputPath);
  } catch (error) {
    console.error("Error:", error);
  }
}
