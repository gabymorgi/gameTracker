import dotenv from "dotenv";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";
import { differenceInDays, subDays } from "date-fns";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
let deltaDays = 0;

const SNAPSHOT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "scripts",
  "files",
  "seed",
);

type PrismaGame = import("./generated/models").GameModel;
type PrismaChangelog = import("./generated/models").ChangelogModel;
type PrismaBook = import("./generated/models").BookModel;
type PrismaBookChangelog = import("./generated/models").BookChangelogModel;
type PrismaTag = import("./generated/models").TagModel;
type PrismaIsaacMod = import("./generated/models").IsaacModModel;
type PrismaIsaacPlayableContent =
  import("./generated/models").IsaacPlayableContentModel;

type SnapshotGame = Omit<PrismaGame, "id" | "start" | "end" | "changelogs"> & {
  start: string;
  end: string;
  changelogs: Array<
    Omit<PrismaChangelog, "id" | "gameId" | "createdAt"> & { createdAt: string }
  >;
};

type SnapshotBook = Omit<PrismaBook, "id" | "start" | "end" | "changelogs"> & {
  start: string;
  end: string;
  changelogs: Array<
    Omit<PrismaBookChangelog, "id" | "bookId" | "createdAt"> & {
      createdAt: string;
    }
  >;
};

type SnapshotIsaacMod = Omit<
  PrismaIsaacMod,
  "id" | "appid" | "playedAt" | "playableContents"
> & {
  appid: string;
  playedAt: string | null;
  playableContents: Array<Omit<PrismaIsaacPlayableContent, "id" | "modId">>;
};

function loadSnapshot<T>(name: string): T[] {
  const path = join(SNAPSHOT_DIR, `${name}.json`);
  if (!fs.existsSync(path)) {
    throw new Error(
      `Seed snapshot not found: ${path}\n` +
        "Generate the snapshots from prod first: npm run scripts -- --db-p (menu: db -> p)",
    );
  }
  return JSON.parse(fs.readFileSync(path, "utf-8")) as T[];
}

// keep all dates relative to the current date
function shiftDates<T>(values: T[]): T[] {
  return values.map((value) => shiftValue(value));
}

function shiftValue<T>(value: T): T {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return subDays(new Date(value), deltaDays).toISOString() as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => shiftValue(item)) as T;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, shiftValue(val)]),
    ) as T;
  }
  return value;
}

async function clearData() {
  await prisma.phrase.deleteMany();
  await prisma.changelog.deleteMany();
  await prisma.bookChangelog.deleteMany();
  await prisma.isaacPlayableContent.deleteMany();
  await prisma.word.deleteMany();
  await prisma.game.deleteMany();
  await prisma.book.deleteMany();
  await prisma.isaacMod.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.admin.deleteMany();
}

async function seedAdmin() {
  await prisma.admin.create({
    data: { email: "admin@example.com", password: "admin" },
  });
}

async function seedTags() {
  const tags = loadSnapshot<PrismaTag>("tags");
  await prisma.tag.createMany({
    data: tags.map(({ id, hue }) => ({ id, hue })),
  });
  console.warn(`Seeded ${tags.length} tags.`);
}

async function seedGames() {
  const games = shiftDates(loadSnapshot<SnapshotGame>("games"));
  for (const { changelogs, ...game } of games) {
    await prisma.game.create({
      data: {
        ...game,
        start: new Date(game.start),
        end: new Date(game.end),
        changelogs: {
          create: changelogs.map(({ createdAt, ...changelog }) => ({
            ...changelog,
            createdAt: new Date(createdAt),
          })),
        },
      },
    });
  }
  console.warn(`Seeded ${games.length} games.`);
}

async function seedBooks() {
  const books = shiftDates(loadSnapshot<SnapshotBook>("books"));
  for (const { changelogs, ...book } of books) {
    await prisma.book.create({
      data: {
        ...book,
        start: new Date(book.start),
        end: new Date(book.end),
        changelogs: {
          create: changelogs.map(({ createdAt, ...changelog }) => ({
            ...changelog,
            createdAt: new Date(createdAt),
          })),
        },
      },
    });
  }
  console.warn(`Seeded ${books.length} books.`);
}

async function seedWords() {
  await prisma.word.create({
    data: {
      value: "ubiquitous",
      definition: "Present, appearing, or found everywhere.",
      pronunciation: "/juːˈbɪkwɪtəs/",
      phrases: {
        create: [
          {
            content: "Smartphones have become ubiquitous.",
            translation: "Los teléfonos inteligentes se han vuelto ubicuos.",
          },
        ],
      },
    },
  });

  await prisma.word.create({
    data: {
      value: "ephemeral",
      definition: "Lasting for a very short time.",
      phrases: {
        create: [{ content: "Fame can be ephemeral." }],
      },
    },
  });
}

async function seedIsaacMod() {
  const mods = shiftDates(loadSnapshot<SnapshotIsaacMod>("isaac-mods"));
  for (const { appid, playableContents, ...mod } of mods) {
    await prisma.isaacMod.create({
      data: {
        ...mod,
        appid: BigInt(appid),
        playedAt: mod.playedAt ? new Date(mod.playedAt) : null,
        playableContents: { create: playableContents },
      },
    });
  }
  console.warn(`Seeded ${mods.length} isaac mods.`);
}

async function seedNotifications() {
  await prisma.notification.createMany({
    data: [
      { message: "Welcome to Game Tracker!" },
      { message: "Hollow Knight was marked as completed." },
    ],
  });
}

async function main() {
  const dateRefPath = join(SNAPSHOT_DIR, `date-ref.json`);
  if (fs.existsSync(dateRefPath)) {
    const dateRefData = JSON.parse(
      await fs.promises.readFile(dateRefPath, "utf-8"),
    );
    const dateRef = new Date(dateRefData.now);
    deltaDays = differenceInDays(new Date(), dateRef);
  }
  await clearData();
  await seedAdmin();
  await seedTags();
  await seedGames();
  await seedBooks();
  await seedWords();
  await seedIsaacMod();
  await seedNotifications();
  console.warn("Seed data created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
