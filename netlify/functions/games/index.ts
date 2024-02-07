import type { Handler } from "@netlify/functions";
import { RouteHandlers } from "../../types";
import routerHandler from "../../utils/routeHandler";
import aggregatesHandler from "./aggregates";
import createHandler from "./create";
import deleteHandler from "./delete";
import getHandler from "./get";
import searchHandler from "./search";
import updateHandler from "./update";

const routeHandlers: Array<RouteHandlers> = [
  aggregatesHandler,
  createHandler,
  deleteHandler,
  getHandler,
  searchHandler,
  updateHandler,
];

const handler: Handler = async (event) => {
  const res = await routerHandler(event, routeHandlers);
  return res;
};

export { handler };
