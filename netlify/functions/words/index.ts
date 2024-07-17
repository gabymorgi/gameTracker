import type { Context } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";

import deleteHandler from "./delete";
import findHandler from "./find";
import getHandler from "./get";
import learnHandler from "./learn";
import progressHandler from "./progress";
import searchHandler from "./search";
import statisticsHandler from "./statistics";
import upsertHandler from "./upsert";

const routeHandlers: Array<RouteHandler> = [
  deleteHandler,
  findHandler,
  getHandler,
  learnHandler,
  progressHandler,
  searchHandler,
  statisticsHandler,
  upsertHandler,
];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export default handler;
