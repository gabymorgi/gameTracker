import type { Context } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import deleteHandler from "./delete";
import getHandler from "./get";
import importHandler from "./import";

const routeHandlers: Array<RouteHandler> = [
  deleteHandler,
  getHandler,
  importHandler,
];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export default handler;
