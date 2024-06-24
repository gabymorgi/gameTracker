import type { Context } from "@netlify/functions";
import { Config } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import deleteHandler from "./delete";
import getGameTagsHandler from "./getGameTags";
import getGlobalHandler from "./getGlobal";
import upsertHandler from "./upsert";

const routeHandlers: Array<RouteHandler> = [
  deleteHandler,
  getGameTagsHandler,
  getGlobalHandler,
  upsertHandler,
];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export const config: Config = {
  path: "/api/tags/:queryPath*",
};

export default handler;
