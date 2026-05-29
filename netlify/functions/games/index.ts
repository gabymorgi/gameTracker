import type { Context } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import aggregatesHandler from "./aggregates";
import createHandler from "./create";
import deleteHandler from "./delete";
import getHandler from "./get";
import pendingHandler from "./pending";
import searchHandler from "./search";
import updateHandler from "./update";

const routeHandlers: Array<RouteHandler> = [
  aggregatesHandler,
  createHandler,
  deleteHandler,
  getHandler,
  pendingHandler,
  searchHandler,
  updateHandler,
];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export default handler;
