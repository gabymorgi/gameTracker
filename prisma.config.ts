import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config();
// PRISMA_ENV=production (set by `npm run db:deploy:prod`) forces prod creds even locally
if (process.env.PRISMA_ENV !== "production") {
  dotenv.config({ path: ".env.local", override: true });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
