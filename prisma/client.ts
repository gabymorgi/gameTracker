import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#prisma-generated-client";

// Do not load .env/.env.local here. Callers resolve env vars:
// - netlify dev injects them natively (so .env.local overrides .env),
// - scripts run via `bun --env-file=.env` and must always hit prod.
// Overriding with .env.local here would incorrectly point scripts at the local db.
export * from "#prisma-generated-client";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
  return url;
}

export function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });
  return new PrismaClient({ adapter });
}
