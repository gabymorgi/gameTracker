/* eslint-disable no-console */
import Prisma from "../utils/prisma.ts";
import { readFile } from "../utils/file.ts";
import { getBatches } from "../utils/batch.ts";
import { wait } from "../utils/promises.ts";
import { fileNames } from "../utils/const.ts";

interface Changelog {
  createdAt: string;
  hours: number;
  achievements: number;
  state: "Won";
}

interface Game {
  appid: number;
  name: string;
  start: string;
  end: string;
  playedTime: number;
  obtainedAchievements: number;
  totalAchievements: number;
  imageUrl: string;
  changelogs: Changelog[];
}

export default async function uploadGames() {
  try {
    const prisma = Prisma.getInstance();
    console.log("Uploading games!");
    const data = await readFile<Game[]>(fileNames.importSteamGamesOutput);
    const batches = getBatches(data, 25);
    let total = 0;
    for (const batch of batches) {
      const gamePromises = batch.map((game) =>
        prisma.game.create({
          data: {
            appid: game.appid,
            name: game.name,
            start: game.start,
            end: game.end,
            playedTime: game.playedTime,
            state: "WON",
            obtainedAchievements: game.obtainedAchievements,
            totalAchievements: game.totalAchievements,
            imageUrl: game.imageUrl,
            changelogs: game.changelogs
              ? {
                  createMany: {
                    data: game.changelogs.map((changelog) => ({
                      createdAt: changelog.createdAt,
                      hours: changelog.hours,
                      achievements: changelog.achievements,
                      state: "WON",
                    })),
                  },
                }
              : undefined,
          },
        }),
      );
      const games = await prisma.$transaction(gamePromises);
      total += games.length;
      console.log("Games created:", total);
      await wait(500);
    }
    console.log("All games uploaded!");
  } catch (error) {
    console.error(error);
  } finally {
    await Prisma.disconnect();
  }
}
