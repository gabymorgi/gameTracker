import { runCommand } from "../utils/console.ts";
import { getPath } from "../utils/file.ts";

export default async function dumpDatabase() {
  const backupPath = getPath(
    `backup-${new Date().toISOString().split("T")[0]}.sql`,
  );
  const command = `pg_dump ${process.env.DIRECT_URL} > ${backupPath}`;
  try {
    await runCommand(command);
  } catch (error) {
    console.error(error);
  }
}
