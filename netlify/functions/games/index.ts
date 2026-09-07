import type { Context } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import statisticsHandler from "./statistics";
import createHandler from "./create";
import deleteHandler from "./delete";
import getHandler from "./get";
import getOstsHandler from "./getOsts";
import getPendingHandler from "./getPending";
import getWithChangelogHandler from "./getWithChangelogs";
import searchHandler from "./search";
import updateHandler from "./update";

const routeHandlers: Array<RouteHandler> = [
  statisticsHandler,
  createHandler,
  deleteHandler,
  getHandler,
  getOstsHandler,
  getPendingHandler,
  getWithChangelogHandler,
  searchHandler,
  updateHandler,
];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export default handler;
