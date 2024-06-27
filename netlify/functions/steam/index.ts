//https://developer.valvesoftware.com/wiki/Steam_Web_API#GetUserStatsForGame_.28v0002.29

import type { Context } from "@netlify/functions";
import { Config } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import recentlyPlayed from "./recentlyPlayed";
import playerAchievements from "./playerAchievements";

const routeHandlers: Array<RouteHandler> = [recentlyPlayed, playerAchievements];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export const config: Config = {
  path: "/api/steam/:queryPath*",
};

export default handler;
