/* eslint-disable no-console */
import fs from "fs";
import { dirname } from "path";
import { subMonths } from "date-fns";
import Prisma from "../utils/prisma.ts";
import { getPath } from "../utils/file.ts";

const MONTHS_BACK = 4;
const ISAAC_MODS_LIMIT = 24;
const BOOKS_LIMIT = 36;

type PrismaClientType = ReturnType<typeof Prisma.getInstance>;

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

async function dumpTags(prisma: PrismaClientType) {
  const tags = await prisma.tag.findMany();
  await writeSnapshot("tags", tags);
  console.log(`Tags: ${tags.length}`);
}

async function dumpGames(prisma: PrismaClientType) {
  const cutoff = subMonths(new Date(), MONTHS_BACK);
  const games = await prisma.game.findMany({
    where: {
      end: { gte: cutoff },
    },
    include: { changelogs: { orderBy: { createdAt: "asc" } } },
  });
  // remove changelogs.gameId to avoid circular references
  const sanitizedGames = games.map((game) => ({
    ...game,
    changelogs: game.changelogs.map(({ gameId, ...changelog }) => changelog),
  }));

  await writeSnapshot("games", sanitizedGames);
  console.log(
    `Games: ${sanitizedGames.length} (with ${sanitizedGames.reduce((acc, game) => acc + game.changelogs.length, 0)} changelogs)`,
  );
}

async function dumpBooks(prisma: PrismaClientType) {
  const books = await prisma.book.findMany({
    include: { changelogs: { orderBy: { createdAt: "asc" } } },
    take: BOOKS_LIMIT,
  });
  // remove changelogs.bookId to avoid circular references
  const sanitizedBooks = books.map((book) => ({
    ...book,
    changelogs: book.changelogs.map(({ bookId, ...changelog }) => changelog),
  }));
  await writeSnapshot("books", sanitizedBooks);
  console.log(
    `Books: ${sanitizedBooks.length} (with ${sanitizedBooks.reduce((acc, book) => acc + book.changelogs.length, 0)} changelogs)`,
  );
}

async function dumpIsaacMods(prisma: PrismaClientType) {
  const mods = await prisma.isaacMod.findMany({
    include: { playableContents: true },
    orderBy: { playedAt: { sort: "desc", nulls: "last" } },
    take: ISAAC_MODS_LIMIT,
  });
  // remove playableContents.modId to avoid circular references
  const sanitizedMods = mods.map((mod) => ({
    ...mod,
    playableContents: mod.playableContents.map(
      ({ modId, ...content }) => content,
    ),
  }));
  await writeSnapshot("isaac-mods", sanitizedMods);
  console.log(
    `Isaac mods: ${sanitizedMods.length} (with ${sanitizedMods.reduce((acc, mod) => acc + mod.playableContents.length, 0)} playable contents)`,
  );
}

export default async function probeSeed() {
  const prisma = Prisma.getInstance();
  try {
    await dumpDateRef();
    await dumpTags(prisma);
    await dumpGames(prisma);
    await dumpBooks(prisma);
    await dumpIsaacMods(prisma);
    console.log("Seed snapshots written to scripts/files/seed/");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
