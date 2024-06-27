import type { Config, Context } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import aggregatesHandler from "./aggregates";
import createHandler from "./create";
import deleteHandler from "./delete";
import getHandler from "./get";
import searchHandler from "./search";
import updateHandler from "./update";

const routeHandlers: Array<RouteHandler> = [
  aggregatesHandler,
  createHandler,
  deleteHandler,
  getHandler,
  searchHandler,
  updateHandler,
];

const handler = async (request: Request, context: Context) => {
  console.log("game index");
  return await routerHandler(request, context, routeHandlers);
};

export const config: Config = {
  path: "/api/games/:queryPath*",
};

export default handler;
