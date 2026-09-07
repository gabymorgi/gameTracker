/* eslint-disable no-console */
import fs from "fs";
import { dirname } from "path";
import { subMonths } from "date-fns";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#prisma-generated-client";
import { getPath } from "../utils/file.ts";

const MONTHS_BACK = 4;
const ISAAC_MODS_LIMIT = 24;
const BOOKS_LIMIT = 36;

// Do NOT use scripts/utils/prisma.ts here: prisma/client.ts force-overrides the
// environment with .env.local, which would point this probe at the local db.
// The probe must target production; `bun --env-file=.env` provides prod creds.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function bigintReplacer(_key: string, value: unknown) {
  return typeof value === "bigint" ? value.toString() : value;
}

async function writeSnapshot(name: string, data: unknown) {
  const path = getPath(`seed/${name}.json`);
  await fs.promises.mkdir(dirname(path), { recursive: true });
  await fs.promises.writeFile(
    path,
    JSON.stringify(data, bigintReplacer, 2),
    "utf-8",
  );
}

async function dumpDateRef() {
  const now = new Date();
  await writeSnapshot("date-ref", { now });
  console.log(`Date reference: ${now.toISOString()}`);
}

async function dumpTags() {
  const tags = await prisma.tags.findMany();
  await writeSnapshot("tags", tags);
  console.log(`Tags: ${tags.length}`);
}

async function dumpGames() {
  const cutoff = subMonths(new Date(), MONTHS_BACK);
  const games = await prisma.game.findMany({
    where: {
      end: { gte: cutoff },
    },
    include: { changelogs: { orderBy: { createdAt: "asc" } } },
  });
  await writeSnapshot("games", games);
  console.log(
    `Games: ${games.length} (with ${games.reduce((acc, game) => acc + game.changelogs.length, 0)} changelogs)`,
  );
}

async function dumpBooks() {
  const books = await prisma.book.findMany({
    include: { changelogs: { orderBy: { createdAt: "asc" } } },
    take: BOOKS_LIMIT,
  });
  await writeSnapshot("books", books);
  console.log(
    `Books: ${books.length} (with ${books.reduce((acc, book) => acc + book.changelogs.length, 0)} changelogs)`,
  );
}

async function dumpIsaacMods() {
  const mods = await prisma.isaacMod.findMany({
    include: { playableContents: true },
    orderBy: { playedAt: { sort: "desc", nulls: "last" } },
    take: ISAAC_MODS_LIMIT,
  });
  await writeSnapshot("isaac-mods", mods);
  console.log(
    `Isaac mods: ${mods.length} (with ${mods.reduce((acc, mod) => acc + mod.playableContents.length, 0)} playable contents)`,
  );
}

export default async function probeSeed() {
  try {
    await dumpDateRef();
    await dumpTags();
    await dumpGames();
    await dumpBooks();
    await dumpIsaacMods();
    console.log("Seed snapshots written to scripts/files/seed/");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
