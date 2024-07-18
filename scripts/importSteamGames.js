import { config } from "dotenv";
import { readFile, writeFile } from "./utils/fileUtils.js";
import fetch from "node-fetch";

config();

async function getAchievements(appId) {
  const searchParams = new URLSearchParams();
  searchParams.set("key", process.env.VITE_STEAM_API_KEY);
  searchParams.set("steamid", process.env.VITE_STEAM_USER_ID);
  searchParams.set("l", "spanish");
  searchParams.set("format", "json");

  searchParams.set("appid", appId);
  const url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.playerstats.achievements || [];
}

async function parse() {
  const data = await readFile("data.json");
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

  await writeFile("output.json", games);
  await writeFile("rawAchievements.json", rawAchievements);
}

parse();
