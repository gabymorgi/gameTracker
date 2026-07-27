import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#prisma-generated-client";

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
