import { CustomHandler } from "../../types";

interface Params {
  appids: string[];
}

const handler: CustomHandler = async (_, params: Params) => {
  if (!params.appids.length) {
    throw new Error("No appids provided");
  }
  const API_KEY = process.env.VITE_STEAM_API_KEY;
  const USER_ID = process.env.VITE_STEAM_USER_ID;
  const HTTPS = process.env.VITE_HTTPS === "true" ? "https" : "http";

  const searchParams = new URLSearchParams();
  searchParams.set("key", API_KEY as string);
  searchParams.set("steamid", USER_ID as string);
  searchParams.set("l", "spanish");
  searchParams.set("format", "json");

  const gameAchievements: Record<
    string,
    Array<{
      apiname: string;
      achieved: number;
      unlocktime: number;
      name: string;
      description: string;
    }>
  > = {};

  for (const appid of params.appids) {
    searchParams.set("appid", appid.toString());
    const url = `${HTTPS}://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?${searchParams.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    gameAchievements[appid] = data.playerstats.achievements || [];
  }

  return gameAchievements;
};

export default {
  path: "playerAchievements",
  handler: handler,
  needsAuth: true,
};
