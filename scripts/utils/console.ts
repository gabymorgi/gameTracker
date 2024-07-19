/* eslint-disable no-console */
import { exec } from "child_process";
import readline from "readline";

export function runCommand(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command}`);
    const process = exec(command);

    process.stdout?.on("data", (data) => {
      console.log(data.toString());
    });

    process.stderr?.on("data", (data) => {
      console.error(data.toString());
    });

    process.on("error", (error) => {
      reject(`Error: ${error.message}`);
    });

    process.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Process ended with error code: ${code}`);
      }
    });
  });
}

export function askQuestion(
  question: string,
  validOptions: string[],
): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const ask = () => {
      rl.question(`\n\n${question}\n\n`, (input) => {
        if (validOptions.includes(input)) {
          rl.close();
          resolve(input);
        } else {
          console.log(
            `Invalid option. Choose one of the following: ${validOptions.join(", ")}`,
          );
          ask();
        }
      });
    };

    ask();
  });
}

export function askInfo(
  question: string,
  validator: (input: string) => Promise<boolean>,
): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const ask = () => {
      rl.question(question, async (input) => {
        if (validator && !(await validator(input))) {
          console.log("Invalid data. try again.");
          ask();
        } else {
          rl.close();
          resolve(input);
        }
      });
    };

    ask();
  });
}
