import { CustomHandler } from "../../types";

const handler: CustomHandler = async () => {
  const API_KEY = process.env.VITE_STEAM_API_KEY;
  const USER_ID = process.env.VITE_STEAM_USER_ID;
  const HTTPS = process.env.VITE_HTTPS === "true" ? "https" : "http";

  const searchParams = new URLSearchParams();
  searchParams.set("key", API_KEY as string);
  searchParams.set("steamid", USER_ID as string);
  searchParams.set("include_appinfo", "true");
  searchParams.set("include_played_free_games", "true");
  searchParams.set("format", "json");

  const url = `${HTTPS}://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?${searchParams.toString()}`;

  const response = await fetch(url);
  const data = await response.json();
  return data.response.games;
};

export default {
  path: "recentlyPlayed",
  handler: handler,
  needsAuth: true,
};
