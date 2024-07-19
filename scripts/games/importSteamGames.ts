/* eslint-disable no-console */
import { writeFile } from "../utils/file.ts";
import fetch from "node-fetch";
import { startOfMonth } from "date-fns";
import { fileNames } from "../utils/const.ts";

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_logo_url: string;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  rtime_last_played: number;
}

interface SteamGameResponse {
  response: {
    games: SteamGame[];
  };
}

interface SteamAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

interface SteamAchievementResponse {
  playerstats: {
    steamID: string;
    gameName: string;
    achievements: SteamAchievement[];
  };
}

async function getGameList(): Promise<SteamGame[]> {
  const searchParams = new URLSearchParams();
  searchParams.set("key", process.env.VITE_STEAM_API_KEY || "");
  searchParams.set("steamid", process.env.VITE_STEAM_USER_ID || "");
  searchParams.set("format", "json");
  searchParams.set("include_played_free_games", "1");
  searchParams.set("include_appinfo", "1");
  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = (await response.json()) as SteamGameResponse;
  return data.response.games;
}

async function getAchievements(appId: number) {
  const searchParams = new URLSearchParams();
  searchParams.set("key", process.env.VITE_STEAM_API_KEY || "");
  searchParams.set("steamid", process.env.VITE_STEAM_USER_ID || "");
  searchParams.set("l", "spanish");
  searchParams.set("format", "json");

  searchParams.set("appid", appId.toString());
  const url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = (await response.json()) as SteamAchievementResponse;
  return data.playerstats.achievements || [];
}

interface RawAchievement {
  appid: number;
  achievements: SteamAchievement[];
}

interface Changelog {
  createdAt: string;
  hours: number;
  achievements: number;
  state: "Won";
}

interface Game {
  name: string;
  playedTime: number;
  appid: number;
  imageUrl: string;
  start: string;
  end: string;
  obtainedAchievements: number;
  totalAchievements: number;
  changelogs: Changelog[];
}

export async function importSteamGames() {
  const steamGames = await getGameList();
  const games: Game[] = [];
  const rawAchievements: RawAchievement[] = [];
  for (const steamGame of steamGames) {
    const achievements = await getAchievements(steamGame.appid);
    rawAchievements.push({
      appid: steamGame.appid,
      achievements,
    });
    const obtainedAchievements = achievements
      .filter((achievement) => achievement.achieved)
      .sort((a, b) => a.unlocktime - b.unlocktime);

    let changelogs: Changelog[] = [];
    if (obtainedAchievements.length) {
      const changelogObj: Record<string, Changelog> = {};
      const playedTimeStep =
        steamGame.playtime_forever / obtainedAchievements.length;
      for (const achievement of obtainedAchievements) {
        const date = startOfMonth(
          new Date(achievement.unlocktime * 1000),
        ).toISOString();
        if (changelogObj[date]) {
          changelogObj[date].achievements += 1;
          changelogObj[date].hours += playedTimeStep;
        } else {
          changelogObj[date] = {
            createdAt: date,
            hours: playedTimeStep,
            achievements: 1,
            state: "Won",
          };
        }
      }
      changelogs = Object.values(changelogObj);
    } else {
      changelogs = [
        {
          createdAt: startOfMonth(
            new Date(steamGame.rtime_last_played * 1000),
          ).toISOString(),
          hours: steamGame.playtime_forever,
          achievements: 0,
          state: "Won",
        },
      ];
    }
    games.push({
      name: steamGame.name,
      playedTime: steamGame.playtime_forever,
      appid: steamGame.appid,
      imageUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${steamGame.appid}/header.jpg`,
      start: obtainedAchievements.length
        ? new Date(obtainedAchievements[0].unlocktime * 1000).toISOString()
        : new Date(steamGame.rtime_last_played * 1000).toISOString(),
      end: new Date(steamGame.rtime_last_played * 1000).toISOString(),
      obtainedAchievements: obtainedAchievements.length,
      totalAchievements: achievements.length,
      changelogs: changelogs,
    });
    console.log("Game:", steamGame.name);
  }

  await writeFile(fileNames.importSteamGamesOutput, games);
  await writeFile(fileNames.importSteamGamesAchievements, rawAchievements);
}
