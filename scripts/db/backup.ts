import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { runCommand } from "../utils/console.ts";

export async function dumpDatabase() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const backupPath = join(
    __dirname,
    "files",
    `backup-${new Date().toISOString().split("T")[0]}.sql`,
  );
  const command = `pg_dump ${process.env.DIRECT_URL} > ${backupPath}`;
  try {
    await runCommand(command);
  } catch (error) {
    console.error(error);
  }
}
