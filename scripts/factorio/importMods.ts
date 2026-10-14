/* eslint-disable no-console */
import fs from "fs";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import Papa from "papaparse";
import Prisma from "../utils/prisma.ts";
import { askQuestion } from "../utils/console.ts";
import { getPath } from "../utils/file.ts";

type ModType = "PLANET" | "OVERHAUL" | "CONTENT" | "MOD_PACK";
type Requirement =
  | "VANILLA"
  | "NEW_SAVE"
  | "SPACE"
  | "VULCANUS"
  | "FULGORA"
  | "GLEBA"
  | "AQUILO";

interface CsvRow {
  id: string;
  Name: string;
  link: string;
  description: string;
  type: string;
  requirements: string;
  dep: string;
  mark: string;
}

const typeMap: Record<string, ModType> = {
  planet: "PLANET",
  overhaul: "OVERHAUL",
  content: "CONTENT",
  modpack: "MOD_PACK",
};

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function parseType(value: string): ModType {
  const type = typeMap[normalizeKey(value)];
  if (!type) throw new Error(`Unknown mod type: "${value}"`);
  return type;
}

function parseRequirement(value: string): Requirement {
  const requirement = normalizeKey(value).toUpperCase() as Requirement;
  const valid: Requirement[] = [
    "VANILLA",
    "NEW_SAVE",
    "SPACE",
    "VULCANUS",
    "FULGORA",
    "GLEBA",
    "AQUILO",
  ];
  if (!valid.includes(requirement)) {
    throw new Error(`Unknown requirement: "${value}"`);
  }
  return requirement;
}

function parseDeps(value: string): string[] {
  return [
    ...new Set(
      value
        .split(",")
        .map((dep) => dep.trim())
        .filter(Boolean),
    ),
  ];
}

async function selectTarget() {
  const target = await askQuestion(
    "Target database:\np: production (.env)\nl: local (.env.local)",
    ["p", "l"],
  );
  if (target === "p") return;

  const envPath = ".env.local";
  if (!fs.existsSync(envPath)) {
    throw new Error(`${envPath} not found`);
  }
  const { DATABASE_URL } = dotenv.parse(fs.readFileSync(envPath));
  if (!DATABASE_URL) {
    throw new Error(`DATABASE_URL missing in ${envPath}`);
  }
  process.env.DATABASE_URL = DATABASE_URL;
}

export default async function importFactorioMods() {
  try {
    await selectTarget();
    const prisma = Prisma.getInstance();

    const existing = await prisma.factorioMod.count();
    if (existing > 0) {
      console.log(
        `FactorioMod table already has ${existing} rows. Aborting to avoid duplicates.`,
      );
      return;
    }

    const csv = fs.readFileSync(getPath("factorio.csv"), "utf-8");
    const { data, errors } = Papa.parse<CsvRow>(csv, {
      header: true,
      skipEmptyLines: true,
    });
    if (errors.length) {
      throw new Error(`CSV parse errors: ${JSON.stringify(errors)}`);
    }

    const uuids = new Map<string, string>(
      data.map((row) => [row.id.trim(), randomUUID()]),
    );

    const mods = data.map((row) => ({
      id: uuids.get(row.id.trim())!,
      name: row.Name.trim(),
      link: row.link.trim(),
      description: row.description?.trim() || null,
      mark: row.mark?.trim() ? Number(row.mark) : -1,
      type: parseType(row.type),
      requirements: parseRequirement(row.requirements),
    }));

    await prisma.factorioMod.createMany({ data: mods });
    console.log(`Created ${mods.length} mods`);

    for (const row of data) {
      const deps = parseDeps(row.dep ?? "");
      if (!deps.length) continue;
      const missing = deps.filter((dep) => !uuids.has(dep));
      if (missing.length) {
        console.warn(
          `Mod ${row.id}: unknown dependencies ${missing.join(", ")}`,
        );
      }
      await prisma.factorioMod.update({
        where: { id: uuids.get(row.id.trim())! },
        data: {
          dependencies: {
            connect: deps
              .filter((dep) => uuids.has(dep))
              .map((dep) => ({ id: uuids.get(dep)! })),
          },
        },
      });
    }
    console.log("Dependencies linked");
  } catch (error) {
    console.error(error);
  } finally {
    await Prisma.disconnect();
  }
}
