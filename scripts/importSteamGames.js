import { readJsonFile, writeJsonFile } from "./utils/fileUtils.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
const __dirname = dirname(fileURLToPath(import.meta.url));

const apiKey = "4B49CDB7D6A4AA765EA04E76A88F29B1";
const steamId = "76561198157378018";

async function getAchievements(appId) {
  const searchParams = new URLSearchParams();
  searchParams.set("key", apiKey);
  searchParams.set("steamid", steamId);
  searchParams.set("l", "spanish");
  searchParams.set("format", "json");

  searchParams.set("appid", appId);
  const url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.playerstats.achievements || [];
}

async function parse() {
  const data = await readJsonFile(join(__dirname, "data.json"));
  const games = [];
  const rawAchievements = [];
  for (const game of data.response.games) {
    const achievements = await getAchievements(game.appid);
    rawAchievements.push({
      appid: game.appid,
      achievements,
    });
    games.push({
      name: game.name,
      playedTime: game.playtime_forever,
      appid: game.appid,
      start: achievements.length
        ? new Date(
            achievements.sort((a, b) => a.unlocktime - b.unlocktime)[0]
              .unlocktime * 1000,
          ).toISOString()
        : new Date(game.rtime_last_played * 1000).toISOString(),
      end: new Date(game.rtime_last_played * 1000).toISOString(),
      obtainedAchievements: achievements.filter(
        (achievement) => achievement.achieved,
      ).length,
      totalAchievements: achievements.length,
    });
    console.log("Game:", game.name);
  }

  await writeJsonFile(join(__dirname, "output.json"), games);
  await writeJsonFile(join(__dirname, "rawAchievements.json"), rawAchievements);
}

parse();
