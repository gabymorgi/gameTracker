//https://developer.valvesoftware.com/wiki/Steam_Web_API#GetUserStatsForGame_.28v0002.29

import type { Context } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import recentlyPlayed from "./recentlyPlayed";
import playerAchievements from "./playerAchievements";
import game from "./game";

const routeHandlers: Array<RouteHandler> = [
  recentlyPlayed,
  playerAchievements,
  game,
];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export default handler;
