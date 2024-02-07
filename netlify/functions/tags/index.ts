import type { Handler } from "@netlify/functions";
import { RouteHandlers } from "../../types";
import routerHandler from "../../utils/routeHandler";
import deleteHandler from "./delete";
import getGameTagsHandler from "./getGameTags";
import getGlobalHandler from "./getGlobal";
import upsertHandler from "./upsert";

const routeHandlers: Array<RouteHandlers> = [
  deleteHandler,
  getGameTagsHandler,
  getGlobalHandler,
  upsertHandler,
];

const handler: Handler = async (event) => {
  const res = await routerHandler(event, routeHandlers);
  return res;
};

export { handler };
