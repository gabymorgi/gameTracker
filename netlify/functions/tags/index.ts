import type { Context } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import deleteHandler from "./delete";
import getGameTagsHandler from "./getGameTags";
import getHandler from "./get";
import upsertHandler from "./upsert";

const routeHandlers: Array<RouteHandler> = [
  deleteHandler,
  getGameTagsHandler,
  getHandler,
  upsertHandler,
];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export default handler;
