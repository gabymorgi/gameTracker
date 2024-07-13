import type { Context } from "@netlify/functions";
import { RouteHandler } from "../../types";
import routerHandler from "../../utils/routeHandler";
import createBatchHandler from "./create-batch";
import deleteBatchHandler from "./delete-batch";
import getBatchHandler from "./get-batch";
import translateBatchHandler from "./translate-batch";

const routeHandlers: Array<RouteHandler> = [
  createBatchHandler,
  deleteBatchHandler,
  getBatchHandler,
  translateBatchHandler,
];

const handler = async (request: Request, context: Context) => {
  return await routerHandler(request, context, routeHandlers);
};

export default handler;
