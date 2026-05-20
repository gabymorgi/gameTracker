import fs from "fs";
import { runCommandWithArgs } from "../utils/console.ts";
import { getPath } from "../utils/file.ts";

export default async function dumpDatabase() {
  const backupPath = getPath(
    `backup-${new Date().toISOString().split("T")[0]}.sql`,
  );
  const connectionUrl = process.env.DIRECT_URL;

  if (!connectionUrl) {
    console.error("DIRECT_URL is not defined.");
    return;
  }

  try {
    await runCommandWithArgs("pg_dump", [
      "-d",
      connectionUrl,
      "--exclude-table=_prisma_migrations",
      "-f",
      backupPath,
    ]);

    // Read the content of the backup file
    const backupContent = await fs.promises.readFile(backupPath, "utf-8");

    // Add the SET session_replication_role = replica; and SET session_replication_role = DEFAULT; commands
    // to allow the backup to be restored in a replica
    const modifiedBackup = `
    SET session_replication_role = replica;

    ${backupContent}

    SET session_replication_role = DEFAULT;
    `;

    // Write the modified backup to the file
    await fs.promises.writeFile(backupPath, modifiedBackup.trim(), "utf-8");
  } catch (error) {
    console.error(error);
  }
}
