import type { Handler } from "@netlify/functions";
import { RouteHandlers } from "../../types";
import routerHandler from "../../utils/routeHandler";
import createHandler from "./create";
import deleteHandler from "./delete";
import getHandler from "./get";
import gamesGetHandler from "./games/get";
import updateHandler from "./update";

const routeHandlers: Array<RouteHandlers> = [
  gamesGetHandler,
  createHandler,
  deleteHandler,
  getHandler,
  updateHandler,
];

const handler: Handler = async (event) => {
  const res = await routerHandler(event, routeHandlers);
  return res;
};

export { handler };
