import { CustomHandler } from "../../types";

const handler: CustomHandler<"steam/playerAchievements"> = async (
  _,
  params,
) => {
  if (!params.appid) {
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

  searchParams.set("appid", params.appid.toString());
  const url = `${HTTPS}://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?${searchParams.toString()}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.playerstats.achievements || [];
};

export default {
  path: "playerAchievements",
  handler: handler,
  needsAuth: true,
};
